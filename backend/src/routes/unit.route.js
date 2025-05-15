const express = require('express');
const { getUnit, getUnitDetail, createUnit, updateUnit, deleteUnit } = require('../controllers/unit.controller');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { CreateUnitSchema, UpdateUnitSchema, DeleteUnitSchema } = require('../schemas/unit.schema');
const unitRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

unitRouter.get('/', asyncHandler(getUnit));
unitRouter.get('/:id', asyncHandler(getUnitDetail));
unitRouter.post('/', validateMiddleware(CreateUnitSchema), asyncHandler(createUnit));
unitRouter.put('/', validateMiddleware(UpdateUnitSchema), asyncHandler(updateUnit));
unitRouter.delete('/:id', validateMiddleware(DeleteUnitSchema), asyncHandler(deleteUnit));

module.exports = unitRouter;