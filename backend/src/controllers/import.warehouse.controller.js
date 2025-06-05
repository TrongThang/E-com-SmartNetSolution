const { createImportWarehouse: createImportWarehouseService, getImportWarehouseService, getImportWarehouseDetailService } = require('../services/import.warehouse.service');

class ImportWarehouseController {
    async getImportWarehouse(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};
        const response = await getImportWarehouseService(filter, limit, sort, order);
        return res.status(response.status_code).json(response);
    }

    async getImportWarehouseDetail(req, res) {
        const { id } = req.params;
        const response = await getImportWarehouseDetailService(id);
        return res.status(response.status_code).json(response);
    }

    async createImportWarehouse(req, res) {
        const { data } = req.body;
        const importWarehouse = await createImportWarehouseService(data);
        
        return res.status(importWarehouse.status_code).json(importWarehouse);
    }
}

module.exports = new ImportWarehouseController();