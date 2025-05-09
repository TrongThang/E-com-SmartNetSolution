const express = require('express');
const { getAllWarrentyTime, getDetailWarrentyTime, createWarrentyTime, updateWarrentyTime, deleteWarrentyTime } = require('../controllers/warrentyTime.controller');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { CreateWarrantyTimeSchema, UpdateWarrantyTimeSchema, DeleteWarrantyTimeSchema } = require('../schemas/warrentyTime.schema');

const warrentyTimeRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

warrentyTimeRouter.get('/', asyncHandler(getAllWarrentyTime));
warrentyTimeRouter.get('/:id', asyncHandler(getDetailWarrentyTime));
warrentyTimeRouter.post('/',  validateMiddleware(CreateWarrantyTimeSchema), asyncHandler(createWarrentyTime));
warrentyTimeRouter.put('/', validateMiddleware(UpdateWarrantyTimeSchema), asyncHandler(updateWarrentyTime));
warrentyTimeRouter.delete('/:id', validateMiddleware(DeleteWarrantyTimeSchema), asyncHandler(deleteWarrentyTime));

module.exports = warrentyTimeRouter;