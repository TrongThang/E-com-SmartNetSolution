const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { createImportWarehouse } = require('../controllers/import.warehouse.controller');
const importWarehouseRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

importWarehouseRouter.post('/', asyncHandler(createImportWarehouse));

module.exports = importWarehouseRouter;