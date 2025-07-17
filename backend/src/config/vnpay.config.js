module.exports = {
    "vnp_TmnCode": process.env.VNPAY_TMN_CODE || "AB6YFS5Z",
    "vnp_HashSecret": process.env.VNPAY_HASH_SECRET || "N4C2834GUZXHSPMIGN9IIYC9IQ4MSQJF",
    "vnp_Url": process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    "vnp_Api": process.env.VNPAY_API || "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
    "vnp_ReturnUrl": process.env.VNPAY_RETURN_URL || "https://www.smartnetsolutions.io.vn/profile/orders",
    
    // ============= DYNAMIC URL CONFIG =============
    "baseUrl": process.env.BASE_URL || "http://localhost:8081",
    "frontendUrl": process.env.FRONTEND_URL || "https://www.smartnetsolutions.io.vn/",
    "mobileAppScheme": process.env.MOBILE_APP_SCHEME || "myapp",
    
    // ============= ENVIRONMENT CONFIG =============
    "environment": process.env.NODE_ENV || "development",
    "isProduction": (process.env.NODE_ENV || "development") === "production"
}