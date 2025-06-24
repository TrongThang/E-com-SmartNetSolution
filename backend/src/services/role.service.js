const { get_error_response } = require('../helpers/response.helper');
const { executeSelectData } = require('../helpers/sql_query');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { getVietnamTimeNow } = require('../helpers/time.helper');
const prisma = require('../config/database');


const getRoleService = async (filter, limit, sort, order) => {
    try {
        const get_attr = `
            role.id as role_id,
            role.name as role_name,
            role.created_at,
            role.updated_at,
            role.deleted_at,
            permission.id as permission_id,
            permission.name as per_name,
            permission.code,
            permission.type,
            permission.show_in_menu
        `;
        const get_table = `role`;
        const query_join = `
            LEFT JOIN permission_role ON role.id = permission_role.role_id
            LEFT JOIN permission ON permission.id = permission_role.permission_id
        `;

        const result = await executeSelectData({
            strGetColumn: get_attr,
            table: get_table,
            queryJoin: query_join,  
            filter: filter,
            limit: limit,
            sort: sort,
            order: order
        });

        // Log result for debugging
        console.log("executeSelectData result:", result);

        // Extract rows from result.data
        const rows = result.data || [];

        // Group permissions by role
        const groupedRoles = rows.reduce((acc, row) => {
            const roleId = row.role_id;
            const roleName = row.role_name;

            // Find or create the role in the accumulator
            let role = acc.find(r => r.id === roleId);
            if (!role) {
                role = {
                    id: roleId,
                    role_name: roleName,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    deleted_at: row.deleted_at,
                    permissions: []
                };
                acc.push(role);
            }

            // Add permission if it exists
            if (row.permission_id) {
                role.permissions.push({
                    id: row.permission_id.toString(), // Convert to string for consistency
                    per_name: row.per_name,
                    code: row.code,
                    type: row.type,
                    show_in_menu: row.show_in_menu
                });
            }

            return acc;
        }, []);

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            {
                data: groupedRoles,
                total_page: result.total_page || Math.ceil(groupedRoles.length / (limit || 10))
            }
        );
    } catch (error) {
        console.error("Error in getRoleService:", error);
        return get_error_response(
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            error.message
        );
    }
};
const getRoleDetailService = async (id) => {
    try {
        const result = await prisma.role.findFirst({
            where: { id: id , deleted_at: null},
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
const createRoleService = async (name) => {
    try {
        const nameExits = await prisma.role.findFirst({
            where: { name: name, deleted_at: null },
        });

        console.log('nameExits', nameExits)

        if (nameExits) {
            return get_error_response(
                ERROR_CODES.ROLE_NAME_EXISTED,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        // Tạo vai trò mới
        const role = await prisma.role.create({
            data: {
                name: name,
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

const updateRoleService = async (id, name) => {
    try {
        const existingRole = await prisma.role.findFirst({
            where: { id: id, deleted_at: null },
        });

        if (!existingRole) {
            return get_error_response(
                ERROR_CODES.ROLE_NOT_FOUND,
                STATUS_CODE.NOT_FOUND,
            );
        }

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

        // Cập nhật thông tin vai trò
        const updatedRole = await prisma.role.update({
            where: {
                id: id,
            },
            data: {
                name,
            },
        });

        // Trả về kết quả thành công
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
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