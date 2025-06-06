const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { createImportWarehouse, getImportWarehouse, getImportWarehouseDetail } = require('../controllers/import.warehouse.controller');
const importWarehouseRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

importWarehouseRouter.get('/', asyncHandler(getImportWarehouse));
importWarehouseRouter.post('/', asyncHandler(createImportWarehouse));
importWarehouseRouter.get('/detail/:id', asyncHandler(getImportWarehouseDetail));

module.exports = importWarehouseRouter;