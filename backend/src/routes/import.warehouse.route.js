const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { createImportWarehouse, getImportWarehouse, getImportWarehouseDetail, getProcessImportWarehouse, importProduct, startImportWarehouse } = require('../controllers/import.warehouse.controller');
const authMiddleware = require('../middleware/auth.middleware');
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
importWarehouseRouter.patch('/start', authMiddleware, asyncHandler(startImportWarehouse));
importWarehouseRouter.post('/import-order', authMiddleware, asyncHandler(importProduct));

module.exports = importWarehouseRouter;