const { getRoleService, getRoleDetailService,
    createRoleService, updateRoleService,
    toggleDeleteRestoreRoleService
} = require('../services/role.service');

class RoleController {
    async getRole(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};
        const response = await getRoleService(filter, limit, sort, order)
        return res.status(response.status_code).json(response);
    }
    async getRoleDetail(req, res) {
        const { id } = req.params;
        
        const response = await getRoleDetailService(Number(id))
        return res.status(response.status_code).json(response);
    }
    async createRole(req, res) {
        const { name } = req.body;
        const response = await createRoleService(name)
        return res.status(response.status_code).json(response);
    }
    async updateRole(req, res) {
        const { id } = req.params;
        const { name } = req.body;
        const response = await updateRoleService(Number(id), name)
        return res.status(response.status_code).json(response);
    }
    async toggleDeleteRestoreRole(req, res) {
        const { id } = req.params;
        const { isRestore } = req.body || {};
        const response = await toggleDeleteRestoreRoleService(Number(id), isRestore)
        return res.status(response.status_code).json(response);
    }
}

module.exports = new RoleController();