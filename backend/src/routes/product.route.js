const express = require('express');
const { getProduct, getProductDetail, createProduct, updateProduct, checkListInfoProduct } = require('../controllers/product.controller');
const { validateMiddleware } = require('../middleware/validate.middleware');
const productRouter = express.Router();

const { CreateProductSchema, UpdateProductSchema, DeleteProductSchema } = require('../schemas/product.schema');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

productRouter.get('/', asyncHandler(getProduct));
productRouter.get('/detail/:id', asyncHandler(getProductDetail));

productRouter.post('/check-list-info', asyncHandler(checkListInfoProduct));
productRouter.post('/', validateMiddleware(CreateProductSchema), asyncHandler(createProduct));
productRouter.put('/', validateMiddleware(UpdateProductSchema), asyncHandler(updateProduct));
productRouter.delete('/', validateMiddleware(), asyncHandler());

module.exports = productRouter;