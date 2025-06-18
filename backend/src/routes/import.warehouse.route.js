const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { createImportWarehouse, getImportWarehouse, getImportWarehouseDetail, getProcessImportWarehouse, importProduct, startImportWarehouse } = require('../controllers/import.warehouse.controller');
const importWarehouseRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

importWarehouseRouter.get('/', asyncHandler(getImportWarehouse));
importWarehouseRouter.get('/detail/:id', asyncHandler(getImportWarehouseDetail));
importWarehouseRouter.get('/process/:id', asyncHandler(getProcessImportWarehouse));

importWarehouseRouter.post('/', asyncHandler(createImportWarehouse));
importWarehouseRouter.patch('/start', asyncHandler(startImportWarehouse));
importWarehouseRouter.post('/import-order', asyncHandler(importProduct));

module.exports = importWarehouseRouter;