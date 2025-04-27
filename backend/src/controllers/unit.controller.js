const {
    getUnitService,
    getUnitDetailService,
    createUnitService,
    updateUnitService,
    deleteUnitService
} = require('../services/unit_service');
const { generateUnitId } = require('../helpers/generate.helper');
const { PrismaClient } = require('@prisma/client');

class UnitController {
    constructor() {
        this.prisma = new PrismaClient();
    }
    async getUnit(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};
        const response = await getUnitService(filter, limit, sort, order);
        return res.status(response.status_code).json(response);
    }

    async getUnitDetail(req, res) {
        const { id } = req.params;
        const response = await getUnitDetailService(id);
        return res.status(response.status_code).json(response);
    }

    async createUnit(req, res) {
        const { name } = req.body;

        const response = await createUnitService({ name });
        return res.status(response.status_code).json(response);
    }

    async updateUnit(req, res) {
        const { id, name } = req.body;
        const response = await updateUnitService({ id: Number(id), name });
        return res.status(response.status_code).json(response);
    }

    async deleteUnit(req, res) {
        const { id } = req.params;
        const response = await deleteUnitService(Number(id));
        return res.status(response.status_code).json(response);
    }
}

module.exports = new UnitController();