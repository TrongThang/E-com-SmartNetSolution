const prisma = require('../config/database');
const redisClient = require('../config/redis');

const checkEmployeePermission = async (req, permissionId) => {
    const employeeId = req.user && req.user.employeeId;
    if (!employeeId) return false;

    // Tìm account
    const account = await prisma.account.findFirst({
        where: {
            employee_id: employeeId,
            deleted_at: null,
            is_locked: false,
        },
    });

    if (!account || !account.role_id) return false;

    const redisKey = `role:${account.role_id}`;
    let permissions = [];

    // Kiểm tra Redis
    const cachedPermissions = await redisClient.get(redisKey);
    if (cachedPermissions) {
        permissions = JSON.parse(cachedPermissions);
    } else {
        const roleWithPermissions = await prisma.role.findUnique({
            where: { id: account.role_id },
            include: {
                permission_role: true,
            },
        });

        if (!roleWithPermissions) return false;

        permissions = roleWithPermissions.permission_role.map(p => p.permission_id);

        await redisClient.set(redisKey, JSON.stringify(permissions));
    }

    return permissions.includes(permissionId);
};

module.exports = {
    checkEmployeePermission
};