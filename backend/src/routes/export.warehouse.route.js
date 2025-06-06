const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getExportWarehouse, createExportWarehouse, getExportWarehouseDetail } = require('../controllers/export.warehouse.controller');
const exportWarehouseRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

exportWarehouseRouter.get('/', asyncHandler(getExportWarehouse));
exportWarehouseRouter.post('/', asyncHandler(createExportWarehouse));
exportWarehouseRouter.get('/detail/:id', asyncHandler(getExportWarehouseDetail));

module.exports = exportWarehouseRouter;