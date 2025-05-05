const { PrismaClient } = require('@prisma/client');
const { getRoleService, getRoleDetailService,
    createRoleService, updateRoleService,
    toggleDeleteRestoreRoleService
} = require('../services/role_service');

class RoleController {
    constructor() {
        this.prisma = new PrismaClient();
    }
    async getRole(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};
        const response = await getRoleService(filter, limit, sort, order)
        return res.status(response.status_code).json(response);
    }
    async getRoleDetail(req, res) {
        const { id } = req.params;
        const response = await getRoleDetailService(id)
        return res.status(response.status_code).json(response);
    }
    async createRole(req, res) {
        const { id, name, permission } = req.body;
        const response = await createRoleService(id, name, permission)
        return res.status(response.status_code).json(response);
    }
    async updateRole(req, res) {
        const { id } = req.params;
        const { name, permission } = req.body;
        const response = await updateRoleService(id, name, permission)
        return res.status(response.status_code).json(response);
    }
    async toggleDeleteRestoreRole(req, res) {
        const { id } = req.params;
        const { isRestore } = req.body || {};
        const response = await toggleDeleteRestoreRoleService(id, isRestore)
        return res.status(response.status_code).json(response);
    }
}

module.exports = new RoleController();