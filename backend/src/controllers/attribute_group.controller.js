const { getAttributeGroupService,
    getAttributeGroupDetailsService,
    createAttributeGroupService,
    updateAttributeGroupService,
    toggleDeleteRestoreAttributeGroupService,
} = require('../services/attribute_group.service');

const { PrismaClient } = require('@prisma/client');
class AttributeGroupsController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getAttributeGroups(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};
        const response = await getAttributeGroupService(filter, limit, sort, order);
        return res.status(response.status_code).json(response);
    }
    async getAttributeGroupDetails(req, res) {
        const { id } = req.params;
        const response = await getAttributeGroupDetailsService(Number(id));
        return res.status(response.status_code).json(response);
    }
    async createAttributeGroup(req, res) {
        const { name, attributes } = req.body || {};
        const response = await createAttributeGroupService(name, attributes);
        return res.status(response.status_code).json(response);
    }
    async updateAttributeGroup(req, res) {
        const { id } = req.params;
        const { name, attributes } = req.body || {};
        const response = await updateAttributeGroupService(Number(id), name, attributes);
        return res.status(response.status_code).json(response);
    }
    async toggleDeleteRestoreAttributeGroup(req, res) {
        const { id } = req.params;
        const { isRestore } = req.body || {};
        const response = await toggleDeleteRestoreAttributeGroupService(Number(id), isRestore);
        return res.status(response.status_code).json(response);
    }
    
}
module.exports = new AttributeGroupsController();