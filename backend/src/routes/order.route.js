const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getOrdersForAdministrator, getOrdersForCustomer, createOrder, canceledOrder, getOrderDetailForAdministrator, respondListOrder, getOrdersForWarehouseEmployee, assignShipperToOrders, shippingOrder, confirmShippingOrder, confirmFinishedOrder } = require('../controllers/order.controller');
const orderRouter = express.Router();
const { create_payment_url, vnpay_return } = require('../services/vnpay.service');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

orderRouter.get('/admin', asyncHandler(getOrdersForAdministrator));
orderRouter.get('/admin/warehouse', asyncHandler(getOrdersForWarehouseEmployee));
orderRouter.get('/admin/detail/:order_id', asyncHandler(getOrderDetailForAdministrator));
orderRouter.get('/customer/:customer_id', asyncHandler(getOrdersForCustomer));
orderRouter.post('/checkout', asyncHandler(createOrder));
orderRouter.put('/customer', asyncHandler(canceledOrder))
orderRouter.put('/finished', asyncHandler(confirmFinishedOrder))

// Confirm đơn hàng
orderRouter.patch('/admin/respond-orders', asyncHandler(respondListOrder));
orderRouter.patch('/admin/assign-shipper', asyncHandler(assignShipperToOrders));
orderRouter.patch('/admin/shipping-order', asyncHandler(shippingOrder));
orderRouter.patch('/admin/finish-shipping-order', asyncHandler(confirmShippingOrder));

// VNPAY
orderRouter.post('/create_payment_url', create_payment_url);
orderRouter.get('/vnpay_return', vnpay_return);

module.exports = orderRouter;



