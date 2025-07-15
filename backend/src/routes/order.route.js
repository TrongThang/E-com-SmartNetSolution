const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { 
    getOrdersForAdministrator, 
    getOrdersForAdministratorEnhanced,
    getOrdersForShipper,
    getOrdersForEmployee,
    getOrdersForCustomer, 
    createOrder, 
    canceledOrder, 
    getOrderDetailForAdministrator, 
    respondListOrder, 
    getOrdersForWarehouseEmployee, 
    assignShipperToOrders, 
    startShippingOrder, 
    confirmShippingOrder, 
    confirmFinishedOrder 
} = require('../controllers/order.controller');
const orderRouter = express.Router();
const { create_payment_url, vnpay_return } = require('../services/vnpay.service');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

// Routes cho administrator
orderRouter.get('/admin', asyncHandler(getOrdersForAdministrator));
orderRouter.get('/admin/enhanced', asyncHandler(getOrdersForAdministratorEnhanced));
orderRouter.get('/admin/warehouse', asyncHandler(getOrdersForWarehouseEmployee));
orderRouter.get('/admin/detail/:order_id', asyncHandler(getOrderDetailForAdministrator));

// Routes cho shipper và employee
orderRouter.get('/shipper/:shipper_id', asyncHandler(getOrdersForShipper));
orderRouter.get('/employee/:employee_id', asyncHandler(getOrdersForEmployee));

// Routes cho customer
orderRouter.get('/customer/:customer_id', asyncHandler(getOrdersForCustomer));
orderRouter.post('/checkout', asyncHandler(createOrder));
orderRouter.put('/customer', asyncHandler(canceledOrder))
orderRouter.patch('/finished', asyncHandler(confirmFinishedOrder))

// Confirm đơn hàng
orderRouter.patch('/admin/respond-orders', asyncHandler(respondListOrder));
orderRouter.patch('/admin/assign-shipper', asyncHandler(assignShipperToOrders));
orderRouter.patch('/admin/shipping-order', asyncHandler(startShippingOrder));
orderRouter.patch('/admin/finish-shipping-order', asyncHandler(confirmShippingOrder));

// VNPAY
orderRouter.post('/create_payment_url', create_payment_url);
orderRouter.get('/vnpay_return', vnpay_return);

// ============= TEST ENDPOINTS =============
orderRouter.get('/test-platform', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const platform = req.query.platform || '';
    const customReturnUrl = req.query.returnUrl || '';
    
    // Detect platform
    let detectedPlatform = 'web';
    if (platform) {
        detectedPlatform = platform.toLowerCase();
    } else if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        detectedPlatform = 'mobile';
    }
    
    // Generate return URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:8081';
    const mobileAppScheme = process.env.MOBILE_APP_SCHEME || 'myapp';
    
    let returnUrl = customReturnUrl;
    if (!returnUrl) {
        if (detectedPlatform === 'mobile') {
            returnUrl = `${mobileAppScheme}://payment`;
        } else {
            returnUrl = `${baseUrl}/api/order/vnpay_return`;
        }
    }
    
    res.json({
        success: true,
        data: {
            platform: detectedPlatform,
            userAgent: userAgent,
            returnUrl: returnUrl,
            baseUrl: baseUrl,
            mobileAppScheme: mobileAppScheme,
            environment: process.env.NODE_ENV || 'development'
        }
    });
});

module.exports = orderRouter;



