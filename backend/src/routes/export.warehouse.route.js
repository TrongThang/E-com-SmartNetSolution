const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const {
    getExportWarehouse,
    createExportWarehouse,
    getExportWarehouseDetail,
    startExportWarehouse,
    exportProduct,
    getProcessExportWarehouse,
    getExportWarehouseNotFinishForEmployee,
    validateExportDevice,
    getDeviceDetails,
    scanExportDevice
} = require('../controllers/export.warehouse.controller');
const exportWarehouseRouter = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

// Existing routes
exportWarehouseRouter.get('/', asyncHandler(getExportWarehouse));
exportWarehouseRouter.get('/detail/:id', asyncHandler(getExportWarehouseDetail));
exportWarehouseRouter.get('/process/:id', asyncHandler(getProcessExportWarehouse));

exportWarehouseRouter.post('/', authMiddleware, asyncHandler(createExportWarehouse));

exportWarehouseRouter.patch('/start', authMiddleware, asyncHandler(startExportWarehouse));
exportWarehouseRouter.patch('/export-order', authMiddleware, asyncHandler(exportProduct));

exportWarehouseRouter.get('/invoice-not-finish', authMiddleware, asyncHandler(getExportWarehouseNotFinishForEmployee));

// New enhanced routes for mobile app
exportWarehouseRouter.post('/validate-device', authMiddleware, asyncHandler(validateExportDevice));
exportWarehouseRouter.get('/device-details', authMiddleware, asyncHandler(getDeviceDetails));
exportWarehouseRouter.post('/scan-device', authMiddleware, asyncHandler(scanExportDevice));

module.exports = exportWarehouseRouter;