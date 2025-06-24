const { createExportWarehouseService, getExportWarehouseService, getExportWarehouseDetailService, startExportWarehouseService, exportProductService, getProcessExportWarehouseService, getExportWarehouseNotFinishForEmployee, exportProductByOrderService } = require('../services/export.warehouse.service');


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
        const account_id = req.user.employeeId;
        const { data } = req.body;

        const response = await createExportWarehouseService(data, account_id);
        console.log('response', response)
        return res.status(response.status_code).json(response);
    }

    async startExportWarehouse(req, res) {
        const account_id = req.user.employeeId;
        const { export_id } = req.body;
        const response = await startExportWarehouseService(export_id, account_id);
        return res.status(response.status_code).json(response);
    }

    async exportProduct(req, res) {
        const account_id = req.user.employeeId;
        const { export_id, order_id, list_product } = req.body;
        const response = await exportProductByOrderService(export_id, order_id, list_product, account_id);
        return res.status(response.status_code).json(response);
    }

    async getExportWarehouseNotFinishForEmployee(req, res) {
        const response = await getExportWarehouseNotFinishForEmployee(req.user.id);
        return res.status(response.status_code).json(response);
    }

}

module.exports = new ExportWarehouseController();