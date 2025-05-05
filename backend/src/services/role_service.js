const { get_error_response } = require('../helpers/response');
const { executeSelectData } = require('../helpers/sql_query');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { getVietnamTimeNow } = require('../helpers/time.helper');
const { PrismaClient } = require('@prisma/client');
const { get } = require('../routes/role_route');

const prisma = new PrismaClient();

const getRoleService = async (filter, limit, sort, order) => {
    try {
        const get_attr = `role.name as role_name, permission.name as per_name, permission.code, permission.type, permission.show_in_menu ,role.created_at, role.updated_at, role.deleted_at`;
        const get_table = `role`;
        const query_join = `LEFT JOIN permission_role ON role.id = permission_role.role_id
        LEFT JOIN permission ON permission.id = permission_role.permission_id`;

        const filter = JSON.stringify([
            {
                field: "role.deleted_at",
                condition: "is",
                value: null,
            }
        ])
        const result = await executeSelectData({
            strGetColumn: get_attr,
            table: get_table,
            queryJoin: query_join,
            filter: filter,
            limit: limit,
            sort: sort,
            order: order
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            result
        );
    } catch (error) {
        console.log(error);
        return get_error_response(STATUS_CODE.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INTERNAL_SERVER_ERROR, error.message);
    }
}
const getRoleDetailService = async (id) => {
    try {
        const get_attr = `role.id, role.name as role_name, role.created_at, role.updated_at, permission.name as permission_name, permission.code as permission_code`;
        const get_table = `role`;
        const query_join = `
            LEFT JOIN permission_role ON role.id = permission_role.role_id
            LEFT JOIN permission ON permission_role.permission_id = permission.id`;

        // Bộ lọc
        const filter = JSON.stringify([
            {
                field: "role.id",
                condition: "=",
                value: id
            }
        ]);

        // Thực hiện truy vấn
        const result = await executeSelectData({
            strGetColumn: get_attr,
            table: get_table,
            queryJoin: query_join,
            filter: filter
        });

        // Trả về kết quả
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            result
        );
    } catch (error) {
        console.error("Error in getRoleDetailService:", error);
        return get_error_response(
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            error.message
        );
    }
};
const createRoleService = async (id, name, permission) => {
    try {
        const nameExits = await prisma.role.findFirst({
            where: { name: name },
        });
        if (nameExits) {
            return get_error_response(
                ERROR_CODES.ROLE_NAME_EXISTED,
                STATUS_CODE.BAD_REQUEST,
            );
        }
        const idExits = await prisma.role.findFirst({
            where: { id: id },
        });
        if (idExits) {
            return get_error_response(
                ERROR_CODES.ROLE_ID_EXISTED,
                STATUS_CODE.BAD_REQUEST,
            );
        }
        // Tạo vai trò mới
        const role = await prisma.role.create({
            data: {
                id: id, // ID phải là String
                name: name,
                created_at: getVietnamTimeNow(),
                permission_role: {
                    create: permission.map(permissionId => ({
                        permission_id: permissionId,
                        created_at: getVietnamTimeNow(),
                    })),
                },
            },
            include: {
                permission_role: {
                    include: {
                        permission: true, // Lấy thông tin chi tiết của quyền
                    },
                },
            },
        });
        // Trả về kết quả thành công
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            role
        );
    } catch (error) {
        console.error("Error in createRoleService:", error);
        return get_error_response(
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            error.message
        );
    }
};

const updateRoleService = async (id, name, permission) => {
    try {

        const nameExits = await prisma.role.findFirst({
            where: {
                name: name,
                NOT: { id: id }
            },
        });
        if (nameExits) {
            return get_error_response(
                ERROR_CODES.ROLE_NAME_EXISTED,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        // Kiểm tra nếu vai trò không tồn tại
        const existingRole = await prisma.role.findUnique({
            where: { id: id },
        });

        if (!existingRole) {
            return get_error_response(
                ERROR_CODES.ROLE_NOT_FOUND,
                STATUS_CODE.NOT_FOUND,
            );
        }

        // Cập nhật thông tin vai trò
        const updatedRole = await prisma.role.update({
            where: {
                id: id,
            },
            data: {
                name,
                updated_at: getVietnamTimeNow(),
            },
        });

        // Xóa các quyền liên kết cũ
        await prisma.permission_role.deleteMany({
            where: {
                role_id: id,
            },
        });

        // Thêm các quyền mới vào bảng permission_role
        if (permission && permission.length > 0) {
            const permissionRoleData = permission.map(permissionId => ({
                role_id: id,
                permission_id: permissionId,
                updated_at: getVietnamTimeNow(),
            }));

            await prisma.permission_role.createMany({
                data: permissionRoleData,
            });
        }

        // Lấy thông tin vai trò cùng danh sách quyền sau khi cập nhật
        const roleWithPermissions = await prisma.role.findUnique({
            where: { id: id },
            include: {
                permission_role: {
                    include: {
                        permission: true, // Lấy thông tin chi tiết của quyền
                    },
                },
            },
        });
        // Trả về kết quả thành công
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            roleWithPermissions
        );
    } catch (error) {
        console.error("Error in updateRoleService:", error);
        return get_error_response(
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            error.message
        );
    }
};

const toggleDeleteRestoreRoleService = async (id, isRestore = false) => {
    try {
        const existingRole = await prisma.role.findUnique({
            where: { id: id },
        });

        if (!existingRole) {
            return get_error_response(
                ERROR_CODES.ROLE_NOT_FOUND,
                STATUS_CODE.NOT_FOUND,
            );
        }

        let role;
        const message = isRestore ? "Khôi phục vai trò thành công" : "Xóa vai trò thành công";
        if (isRestore) {
            // Khôi phục (Nếu isRestore = true, xóa giá trị deleted_at để khôi phục)
            role = await prisma.role.update({
                where: { id: id },
                data: {
                    deleted_at: null,  // Khôi phục vai trò (xóa giá trị deleted_at)
                },
            });

            await prisma.permission_role.updateMany({
                where: { role_id: id },
                data: { deleted_at: null },  // Khôi phục quyền liên quan
            });

            return get_error_response(
                ERROR_CODES.SUCCESS,
                STATUS_CODE.OK,
                message
            );
        } else {
            // Xóa mềm (Nếu isRestore = false, thực hiện xóa mềm)
            role = await prisma.role.update({
                where: { id: id },
                data: {
                    deleted_at: getVietnamTimeNow(),  // Gán thời gian xóa
                },
            });

            await prisma.permission_role.updateMany({
                where: { role_id: id },
                data: { deleted_at: getVietnamTimeNow() },  // Xóa quyền liên quan
            });

            return get_error_response(
                ERROR_CODES.SUCCESS,
                STATUS_CODE.OK,
                message
            );
        }
    } catch (error) {
        console.error("Error in toggleDeleteRestoreRoleService:", error);
        return get_error_response(
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            error.message
        );
    }
};

module.exports = {
    getRoleService,
    getRoleDetailService,
    createRoleService,
    updateRoleService,
    toggleDeleteRestoreRoleService,
}
