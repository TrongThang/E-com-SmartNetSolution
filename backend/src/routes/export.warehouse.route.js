const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getExportWarehouse, createExportWarehouse, getExportWarehouseDetail, startExportWarehouse, exportProduct, getProcessExportWarehouse } = require('../controllers/export.warehouse.controller');
const exportWarehouseRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

exportWarehouseRouter.get('/', asyncHandler(getExportWarehouse));
exportWarehouseRouter.get('/detail/:id', asyncHandler(getExportWarehouseDetail));
exportWarehouseRouter.get('/process/:id', asyncHandler(getProcessExportWarehouse));

exportWarehouseRouter.post('/', asyncHandler(createExportWarehouse));

exportWarehouseRouter.post('/start', asyncHandler(startExportWarehouse));
exportWarehouseRouter.patch('/export', asyncHandler(exportProduct));


module.exports = exportWarehouseRouter;