const { PrismaClient } = require('@prisma/client');
const { createExportWarehouseService } = require('../services/export.warehouse.service');


class ExportWarehouseController {
    async getExportWarehouse(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};

        const response = await getExportWarehouseService(filter, limit, sort, order);

        return res.status(response.status_code).json(response);
    }

    async createExportWarehouse(req, res) {
        const { data } = req.body;

        const response = await createExportWarehouseService(data);
        console.log('response', response)
        return res.status(response.status_code).json(response);
    }
    
}

module.exports = new ExportWarehouseController();