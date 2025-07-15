const { createExportWarehouseService, getExportWarehouseService, getExportWarehouseDetailService, startExportWarehouseService, exportProductService, getProcessExportWarehouseService, getExportWarehouseNotFinishForEmployee, exportProductByOrderService,  validateExportDeviceService,
    getDeviceDetailsService,
    scanExportDeviceService } = require('../services/export.warehouse.service');


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
        const accountId = req.user.employeeId || req.user.userId;
        
        const response = await getExportWarehouseNotFinishForEmployee(accountId);
        return res.status(response.status_code).json(response);
    }


    /**
     * Validate device for export
     * POST /export-warehouse/validate-device
     * Body: { export_id, serial_number }
     */
    async validateExportDevice(req, res) {
        try {
            const { export_id, serial_number } = req.body;
            const account_id = req.user.account_id;

            // Validate required fields
            if (!export_id || !serial_number) {
                return res.status(400).json({
                    success: false,
                    status_code: 400,
                    errors: [{
                        code: 'MISSING_REQUIRED_FIELDS',
                        message: 'Export ID and serial number are required'
                    }]
                });
            }

            const result = await validateExportDeviceService(export_id, serial_number, account_id);

            return res.status(result.status_code).json({
                success: result.status_code === 200,
                status_code: result.status_code,
                data: result.data,
                errors: result.status_code !== 200 ? [{
                    code: result.error_code,
                    message: result.message
                }] : undefined
            });

        } catch (error) {
            console.error('[Controller] Validate Export Device Error:', error);
            return res.status(500).json({
                success: false,
                status_code: 500,
                errors: [{
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Internal server error occurred'
                }]
            });
        }
    }

    /**
     * Get device details
     * GET /export-warehouse/device-details?serial_number=xxx
     */
    async getDeviceDetails(req, res) {
        try {
            const { serial_number } = req.query;

            if (!serial_number) {
                return res.status(400).json({
                    success: false,
                    status_code: 400,
                    errors: [{
                        code: 'MISSING_SERIAL_NUMBER',
                        message: 'Serial number is required'
                    }]
                });
            }

            const result = await getDeviceDetailsService(serial_number);

            return res.status(result.status_code).json({
                success: result.status_code === 200,
                status_code: result.status_code,
                data: result.data,
                errors: result.status_code !== 200 ? [{
                    code: result.error_code,
                    message: result.message
                }] : undefined
            });

        } catch (error) {
            console.error('[Controller] Get Device Details Error:', error);
            return res.status(500).json({
                success: false,
                status_code: 500,
                errors: [{
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Internal server error occurred'
                }]
            });
        }
    }

    /**
     * Scan device for export (enhanced version)
     * POST /export-warehouse/scan-device
     * Body: { export_id, serial_number }
     */
    async scanExportDevice(req, res) {
        try {
            const { export_id, serial_number } = req.body;
            const account_id = req.user.account_id;

            // Validate required fields
            if (!export_id || !serial_number) {
                return res.status(400).json({
                    success: false,
                    status_code: 400,
                    errors: [{
                        code: 'MISSING_REQUIRED_FIELDS',
                        message: 'Export ID and serial number are required'
                    }]
                });
            }

            const result = await scanExportDeviceService(export_id, serial_number, account_id);

            return res.status(result.status_code).json({
                success: result.status_code === 200,
                status_code: result.status_code,
                data: result.data,
                errors: result.status_code !== 200 ? [{
                    code: result.error_code,
                    message: result.message
                }] : undefined
            });

        } catch (error) {
            console.error('[Controller] Scan Export Device Error:', error);
            return res.status(500).json({
                success: false,
                status_code: 500,
                errors: [{
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Internal server error occurred'
                }]
            });
        }
    }

}

module.exports = new ExportWarehouseController();