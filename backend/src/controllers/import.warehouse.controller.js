const { createImportWarehouse: createImportWarehouseService, getImportWarehouseService, getImportWarehouseDetailService, getProcessImportWarehouseService, importProductService, StartImportWarehouseService } = require('../services/import.warehouse.service');

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

    async getProcessImportWarehouse(req, res) {
        const { id } = req.params;
        const response = await getProcessImportWarehouseService(id);
        return res.status(response.status_code).json(response);
    }

    async startImportWarehouse(req, res) {
        // const employee_id = req.user.id;
        const employee_id = '1';
        const { import_id } = req.body;

        const response = await StartImportWarehouseService(import_id, employee_id);
        return res.status(response.status_code).json(response);
    }

    async importProduct(req, res) {
        // const employee_id = req.user.id;
        const employee_id = '1';
        // mã phiếu nhập + serial_number
        const { import_id, serial_number } = req.body;
        const response = await importProductService(import_id, serial_number, employee_id);
        return res.status(response.status_code).json(response);
    }
}

module.exports = new ImportWarehouseController();