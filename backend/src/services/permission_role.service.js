const { ERROR_CODES, STATUS_CODE } = require("../contants/errors");
const { get_error_response } = require("../helpers/response.helper");
const prisma = require('../config/database');

function diffPermission(request, in_db) {
    // request = [1, 2, 3]
    console.log(request, in_db)

    const requestSet = new Set(request.map(id => id));
    const dbSet = new Set(in_db.map(id => id));
    
    const toAdd = [];
    const toDelete = [];

    // Những quyền trong request nhưng không có trong DB => thêm
    requestSet.forEach(id => {
        if (!dbSet.has(id)) {
            toAdd.push(id);
        }
    });

    // Những quyền trong DB nhưng không có trong request => xóa
    dbSet.forEach(id => {
        if (!requestSet.has(id)) {
            toDelete.push(id);
        }
    });

    return { toAdd, toDelete };
}

async function configDataForMenu(permissions, allPermissions) {
    const type = [];
    const permissionMap = new Map();

    // Group permissions by type
    allPermissions.forEach(permission => {
        const { type, name, code, show_in_menu, id } = permission;
        
        if (!permissionMap.has(type)) {
            permissionMap.set(type, {
                type,
                show_in_menu,
                items: []
            });
        }
        
        permissionMap.get(type).items.push({
            id,
            name,
            code,
            active: permissions.some(p => p.permission_id === id)
        });
        
    });

    // Convert map to array
    permissionMap.forEach((value) => {
        type.push(value);
    });
    
    return type;
}


async function getRoleService() {
    const roles = await prisma.role.findMany({
        where: {
            deleted_at: null
        },
        include: {
            permission_role: {
                where: {
                    deleted_at: null
                },
                select: {
                    permission: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            code: true,
                            show_in_menu: true,
                        },
                    }
                }
            }
        }
    })

    
    return { status_code: STATUS_CODE.OK, data: roles };
}

async function getPermissionRoleService(role_id) {
    const role = await prisma.role.findFirst({
        where: {
            id: Number(role_id),
            deleted_at: null
        },
        include: {
            permission_role: {
                where: {
                    deleted_at: null
                },
                select: {
                    permission_id: true,
                    permission: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            code: true,
                            show_in_menu: true,
                        }
                    }
                }
            }
        }
    })

    if (!role) {
        return get_error_response(ERROR_CODES.NOT_FOUND, STATUS_CODE.NOT_FOUND, "Role không tồn tại")
    }

    const existingPermissions = await prisma.permission.findMany({
        where: {
            deleted_at: null
        },
        select: {
            id: true,
            name: true,
            type: true,
            code: true,
            show_in_menu: true,
        },
    })

    const permissionConfigData = await configDataForMenu(role.permission_role, existingPermissions)

    return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, {
        role_id: role.id,
        permissionConfigData
    })
}   

async function modifyPermissionForRoleService(payload) {
    // permission là mảng các id -- [1, 2, 3]
    const { role_id, permissions } = payload;
    console.log('payload', payload)
    try {
        const role = await prisma.role.findFirst({
            where: {
                id: Number(role_id),
                deleted_at: null
            },
            include: {
                permission_role: {
                    where: {
                        deleted_at: null
                    },
                    select: {
                        permission_id: true,
                    }
                }
            }
        })

        if (!role) {
            // return get_error_response(ERROR_CODES.NOT_FOUND, STATUS_CODE.NOT_FOUND);

            return {
                status_code: STATUS_CODE.NOT_FOUND,
                message: "Role không tồn tại"
            }
        }

        const existingPermissions = await prisma.permission.findMany({
            where: {
                deleted_at: null
            },
            select: {
                id: true,
            },
        })


        // Lấy tất cả các permission của role
        const permissionsInRole = role.permission_role.map(item => item.permission_id)

        const { toAdd, toDelete } = diffPermission(permissions, permissionsInRole)
        console.log('toAdd', toAdd)
        console.log('toDelete', toDelete)
        // Transaction
        prisma.$transaction(async (tx) => {
            if (toAdd.length > 0) {
                for (const permission of toAdd) {
                    const isExistPermission = existingPermissions.find(item => item.id === permission)

                    if (!isExistPermission) {
                        return get_error_response(ERROR_CODES.PERMISSION_NOT_FOUND, STATUS_CODE.NOT_FOUND, "Quyền không tồn tại")
                    }
                }
                
                await tx.permission_role.createMany({
                    data: toAdd.map(permission => ({
                        role_id: role_id,
                        permission_id: permission,
                        deleted_at: null
                    }))
                })
            }
            
            if (toDelete.length > 0) {
                for (const permission of toDelete) {
                    const isExistPermission = existingPermissions.find(item => item.id === permission)

                    if (!isExistPermission) {
                        return get_error_response(ERROR_CODES.PERMISSION_NOT_FOUND, STATUS_CODE.NOT_FOUND, "Quyền không tồn tại")
                    }
                }

                await tx.permission_role.updateMany({
                    where: {
                        role_id: Number(role_id),
                        permission_id: { in: toDelete }
                    },
                    data: {
                        deleted_at: new Date()
                    }
                })
            }
        })  


        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, "Cập nhật quyền thành công")

    } catch (error) {
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR, error.message)
    }
}

module.exports = {
    getPermissionRoleService,
    modifyPermissionForRoleService,
    getRoleService
}