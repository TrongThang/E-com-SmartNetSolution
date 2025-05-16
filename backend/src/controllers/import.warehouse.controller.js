const { createImportWarehouse: createImportWarehouseService } = require('../services/import.warehouse.service');

class ImportWarehouseController {
    async createImportWarehouse(req, res) {
        const { data } = req.body;
        const importWarehouse = await createImportWarehouseService(data);
        
        return res.status(importWarehouse.status_code).json(importWarehouse);
    }
}

module.exports = new ImportWarehouseController();