const { PrismaClient } = require('@prisma/client');
const { getPermissionRoleService, modifyPermissionForRoleService, getRoleService } = require('../services/permission_role.service');
const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');

class PermissionRoleController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getRole(req, res) {
        const response = await getRoleService()

        return res.status(response.status_code).json(response);
    }

    async getPermissionRole(req, res) { 
        const { role_id } = req.query;

        const response = await getPermissionRoleService(role_id)

        return res.status(response.status_code).json(response);
    }

    async modifyPermissionForRole(req, res) {
        const payload = req.body;

        const response = await modifyPermissionForRoleService(payload)
        console.log('response', response)
        return res.status(response.status_code).json(response);
    }
}

module.exports = new PermissionRoleController();