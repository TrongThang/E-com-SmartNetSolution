const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getExportWarehouse, createExportWarehouse } = require('../controllers/export.warehouse.controller');
const exportWarehouseRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

exportWarehouseRouter.get('/', asyncHandler(getExportWarehouse));
exportWarehouseRouter.post('/', asyncHandler(createExportWarehouse));

module.exports = exportWarehouseRouter;