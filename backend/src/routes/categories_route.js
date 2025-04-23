const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getCategories, getCategoriesDetail, createCategories } = require('../controllers/categoriesController');
const categoriesRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

categoriesRouter.get('/', asyncHandler(getCategories));
categoriesRouter.get('/:id', asyncHandler(getCategoriesDetail));
categoriesRouter.post('/', asyncHandler(createCategories));

module.exports = categoriesRouter;