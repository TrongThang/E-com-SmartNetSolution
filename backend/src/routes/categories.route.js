const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { createCategoriesSchema, updateCategoriesSchema } = require('../schemas/categories.schema');
const { getCategories, getCategoriesDetail, createCategories,
    updateCategories, deletedSoftCategories,
    deletedCategories, restoreCategories, } = require('../controllers/categories.controller');
const categoriesRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

categoriesRouter.get('/', asyncHandler(getCategories));
categoriesRouter.get('/detail/:id', asyncHandler(getCategoriesDetail));
categoriesRouter.post('/', validateMiddleware(createCategoriesSchema), asyncHandler(createCategories));
categoriesRouter.put('/:id', validateMiddleware(updateCategoriesSchema), asyncHandler(updateCategories));
categoriesRouter.delete('/:id', asyncHandler(deletedCategories));
categoriesRouter.patch('/:id/softDelete', asyncHandler(deletedSoftCategories));
categoriesRouter.patch('/:id/restore', asyncHandler(restoreCategories));

module.exports = categoriesRouter;