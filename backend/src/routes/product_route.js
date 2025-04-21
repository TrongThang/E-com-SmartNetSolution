const express = require('express');
const { } = require('../controllers/productController');
const { validateMiddleware } = require('../middleware/validate.middleware');
const productRouter = express.Router();

const { } = require('../schemas/product.schema');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

productRouter.get('/', validateMiddleware(), asyncHandler());
productRouter.get('/:id', validateMiddleware(), asyncHandler());
productRouter.post('/', validateMiddleware(), asyncHandler());
productRouter.put('/', validateMiddleware(), asyncHandler());
productRouter.delete('/', validateMiddleware(), asyncHandler());