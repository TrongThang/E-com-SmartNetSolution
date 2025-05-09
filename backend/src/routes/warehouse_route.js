const express = require('express');
const { getWarehouse, getWarehouseDetail, createWarehouse, updateWarehouse, deleteWarehouse } = require('../controllers/warehouse.controller');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { CreateWarehouseSchema, UpdateWarehouseSchema, DeleteWarehouseSchema } = require('../schemas/warehouse.schema');
const warehouseRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

warehouseRouter.get('/', asyncHandler(getWarehouse));
warehouseRouter.get('/:id', asyncHandler(getWarehouseDetail));
warehouseRouter.post('/', validateMiddleware(CreateWarehouseSchema), asyncHandler(createWarehouse));
warehouseRouter.put('/', validateMiddleware(UpdateWarehouseSchema), asyncHandler(updateWarehouse));
warehouseRouter.delete('/:id', validateMiddleware(DeleteWarehouseSchema), asyncHandler(deleteWarehouse));

module.exports = warehouseRouter;