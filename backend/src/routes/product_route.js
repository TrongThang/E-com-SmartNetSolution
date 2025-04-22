const express = require('express');
const { getProduct, getProductDetail } = require('../controllers/product.controller');
const { validateMiddleware } = require('../middleware/validate.middleware');
const productRouter = express.Router();

// const { } = require('../schemas/product.schema');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

productRouter.get('/', asyncHandler(getProduct));
productRouter.get('/:id', asyncHandler(getProductDetail));
productRouter.post('/', validateMiddleware(), asyncHandler());
productRouter.put('/', validateMiddleware(), asyncHandler());
productRouter.delete('/', validateMiddleware(), asyncHandler());

module.exports = productRouter;