const { createExportWarehouseService, getExportWarehouseService, getExportWarehouseDetailService, startExportWarehouseService, exportProductService, getProcessExportWarehouseService, getExportWarehouseNotFinishForEmployee } = require('../services/export.warehouse.service');


class ExportWarehouseController {
    async getExportWarehouse(req, res) {
        const { filter, limit, sort, order } = req.query || {};
        
        const response = await getExportWarehouseService(filter, limit, sort, order);

        return res.status(response.status_code).json(response);
    }

    async getExportWarehouseDetail(req, res) {
        const { id } = req.params;

        const response = await getExportWarehouseDetailService(id);

        return res.status(response.status_code).json(response);
    }

    async getProcessExportWarehouse(req, res) {
        const { id } = req.params;
        const response = await getProcessExportWarehouseService(id);
        return res.status(response.status_code).json(response);
    }

    async createExportWarehouse(req, res) {
        // const account_id = req.user.id;
        const account_id = 'CUST5QL4N3FV51NLUY895SCRHZFV';
        const { data } = req.body;

        const response = await createExportWarehouseService(data, account_id);
        console.log('response', response)
        return res.status(response.status_code).json(response);
    }

    async startExportWarehouse(req, res) {
        // const account_id = req.user.id;
        const account_id = 'CUST5QL4N3FV51NLUY895SCRHZFV';
        const { export_id } = req.body;
        const response = await startExportWarehouseService(export_id, account_id);
        return res.status(response.status_code).json(response);
    }

    async exportProduct(req, res) {
        // const account_id = req.user.id;
        const account_id = '1';
        const { export_id, batch_production_id, template_id, serial_number } = req.body;
        const response = await exportProductService(export_id, batch_production_id, template_id, serial_number, account_id);
        return res.status(response.status_code).json(response);
    }

    async getExportWarehouseNotFinishForEmployee(req, res) {
        const response = await getExportWarehouseNotFinishForEmployee(req.user.id);
        return res.status(response.status_code).json(response);
    }

}

module.exports = new ExportWarehouseController();