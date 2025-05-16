const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getOrdersForAdministrator, getOrdersForCustomer, createOrder } = require('../controllers/order.controller');
const orderRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

orderRouter.get('/admin', asyncHandler(getOrdersForAdministrator));
orderRouter.get('/customer/:customer_id', asyncHandler(getOrdersForCustomer));
orderRouter.post('/checkout', asyncHandler(createOrder));

module.exports = orderRouter;



