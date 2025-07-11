const { getRedisClient } = require('../config/redis.config');
const prisma = require('../config/database');

/**
 * Cập nhật quyền trong Redis
 * @param {number} role_id - ID của role
 * @param {Array} lstAddPermission - Danh sách ID quyền cần thêm
 * @param {Array} lstRemovePermission - Danh sách ID quyền cần xóa
 * @returns {Object} Kết quả cập nhật
 */
async function updatePermissionInRedis(role_id, lstAddPermission = null, lstRemovePermission = null) {
    const redisClient = getRedisClient();
    
    // Nếu Redis không available, log warning và return success
    if (!redisClient) {
        console.warn('Redis client not available, skipping permission cache update');
        return {
            permissions: [],
            success: true,
            message: 'Redis not available'
        };
    }

    const redisKey = `permission:${role_id}`;
    
    try {
        // Xóa quyền không còn sử dụng
        if (lstRemovePermission && lstRemovePermission.length > 0) {
            // Lấy thông tin permission_code của các quyền cần xóa
            const removePermissions = await prisma.permission.findMany({
                where: {
                    id: { in: lstRemovePermission },
                    deleted_at: null
                },
                select: {
                    permission_code: true
                }
            });

            for (const permission of removePermissions) {
                await redisClient.sRem(redisKey, permission.permission_code);
                console.log(`🗑️ Xóa quyền khỏi Redis: ${permission.permission_code}`);
            }
        }

        // Thêm quyền mới
        if (lstAddPermission && lstAddPermission.length > 0) {
            // Lấy thông tin permission_code của các quyền cần thêm
            const addPermissions = await prisma.permission.findMany({
                where: {
                    id: { in: lstAddPermission },
                    deleted_at: null
                },
                select: {
                    permission_code: true
                }
            });

            for (const permission of addPermissions) {
                await redisClient.sAdd(redisKey, permission.permission_code);
                console.log(`➕ Thêm quyền vào Redis: ${permission.permission_code}`);
            }
        }

        // Kiểm tra lại danh sách quyền trong Redis
        const updatedPermissions = await redisClient.sMembers(redisKey);
        console.log("📋 Danh sách quyền sau khi cập nhật:", updatedPermissions);

        return {
            permissions: updatedPermissions,
            success: true,
            message: 'Permission cache updated successfully'
        };
    } catch (error) {
        console.error('❌ Lỗi cập nhật quyền Redis:', error);
        return {
            permissions: [],
            success: false,
            error: error.message
        };
    }
}

/**
 * Lấy tất cả quyền của role từ Redis
 * @param {number} role_id - ID của role
 * @returns {Array} Danh sách quyền
 */
async function getPermissionsFromRedis(role_id) {
    const redisClient = getRedisClient();
    
    if (!redisClient) {
        return [];
    }

    const redisKey = `permission:${role_id}`;
    
    try {
        const permissions = await redisClient.sMembers(redisKey);
        return permissions;
    } catch (error) {
        console.error('❌ Lỗi lấy quyền từ Redis:', error);
        return [];
    }
}

/**
 * Xóa cache quyền của role
 * @param {number} role_id - ID của role
 * @returns {boolean} Kết quả xóa
 */
async function clearPermissionsFromRedis(role_id) {
    const redisClient = getRedisClient();
    
    if (!redisClient) {
        return false;
    }

    const redisKey = `permission:${role_id}`;
    
    try {
        await redisClient.del(redisKey);
        console.log(`🗑️ Đã xóa cache quyền cho role ${role_id}`);
        return true;
    } catch (error) {
        console.error('❌ Lỗi xóa cache quyền từ Redis:', error);
        return false;
    }
}

module.exports = {
    updatePermissionInRedis,
    getPermissionsFromRedis,
    clearPermissionsFromRedis
};