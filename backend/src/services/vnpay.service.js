const vnpayConfig = require('../config/vnpay.config')
let express = require('express');
// const request = require('request');
const moment = require('moment');

const create_payment_url = (req, res, next) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let tmnCode = vnpayConfig.vnp_TmnCode;
    let secretKey = vnpayConfig.vnp_HashSecret;
    let vnpUrl = vnpayConfig.vnp_Url;
    
    // ============= DYNAMIC RETURN URL LOGIC =============
    let returnUrl = getDynamicReturnUrl(req);
    
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    
    let locale = req.body.language;
    if (locale === null || locale === '' || locale === undefined){
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    
    console.log('🔗 Dynamic Return URL:', returnUrl);
    console.log('📱 Platform detected:', detectPlatform(req));
    
    return res.json({ 
        status_code: 200, 
        paymentUrl: vnpUrl,
        returnUrl: returnUrl,
        platform: detectPlatform(req)
    });
} 

// ============= DYNAMIC RETURN URL FUNCTIONS =============
function getDynamicReturnUrl(req) {
    const platform = detectPlatform(req);
    const baseUrl = process.env.BASE_URL || 'http://localhost:8081';
    const mobileAppScheme = process.env.MOBILE_APP_SCHEME || 'myapp';
    
    // Lấy custom return URL từ request nếu có
    const customReturnUrl = req.body.returnUrl || req.query.returnUrl;
    if (customReturnUrl) {
        console.log('🎯 Using custom return URL:', customReturnUrl);
        return customReturnUrl;
    }
    
    // Tạo return URL dựa trên platform
    switch (platform) {
        case 'mobile':
            // Deeplink cho mobile app
            return `${mobileAppScheme}://payment`;
            
        case 'web':
        default:
            // URL thông thường cho web
            return `${baseUrl}/api/order/vnpay_return`;
    }
}

function detectPlatform(req) {
    // Kiểm tra User-Agent để detect platform
    const userAgent = req.headers['user-agent'] || '';
    const platform = req.body.platform || req.query.platform || '';
    
    // Nếu có platform được chỉ định rõ ràng
    if (platform) {
        return platform.toLowerCase();
    }
    
    // Detect từ User-Agent
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        return 'mobile';
    }
    
    // Detect từ headers khác
    if (req.headers['x-platform'] === 'mobile' || req.headers['x-app-version']) {
        return 'mobile';
    }
    
    return 'web';
}

const vnpay_return = (req, res, next) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = vnpayConfig.vnp_TmnCode;
    let secretKey = vnpayConfig.vnp_HashSecret;

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

    if (secureHash === signed) {
        console.log('✅ Thanh toán thành công:', vnp_Params['vnp_ResponseCode'])
        
        // ============= DYNAMIC REDIRECT LOGIC =============
        const redirectUrl = getRedirectUrl(req, vnp_Params);
        console.log('🔄 Redirecting to:', redirectUrl);
        
        return res.redirect(redirectUrl);
    } else {
        console.log('❌ Sai chữ ký VNPay');
        // Redirect về trang lỗi
        return res.redirect(`https://www.smartnetsolutions.io.vn/profile/orders?paymentStatus=invalid`);
    }
};

function getRedirectUrl(req, vnp_Params) {
    const baseUrl = process.env.FRONTEND_URL || 'https://www.smartnetsolutions.io.vn';
    const mobileAppScheme = process.env.MOBILE_APP_SCHEME || 'myapp';
    
    // Xác định status dựa trên response code
    let status = 'fail';
    if (vnp_Params['vnp_ResponseCode'] === '00') {
        status = 'success';
    }
    
    // Tạo redirect URL dựa trên platform
    // Có thể detect từ referer hoặc tham số khác
    const referer = req.headers.referer || '';
    
    if (referer.includes('mobile') || referer.includes('app')) {
        // Deeplink cho mobile app
        return `${mobileAppScheme}://payment?status=${status}&orderId=${vnp_Params['vnp_TxnRef']}`;
    } else {
        // URL thông thường cho web
        return `${baseUrl}/profile/orders?paymentStatus=${status}&orderId=${vnp_Params['vnp_TxnRef']}`;
    }
}

function sortObject(obj) {
    // ============= VALIDATION =============
    if (!obj || typeof obj !== 'object' || obj === null) {
        console.error('❌ sortObject: Invalid object provided:', obj);
        return {};
    }
    
    try {
        // ============= SAFE SORTING =============
        return Object.keys(obj)
            .filter(key => obj[key] !== null && obj[key] !== undefined)
            .sort()
            .reduce((result, key) => {
                const encodedKey = encodeURIComponent(key);
                const encodedValue = encodeURIComponent(String(obj[key])).replace(/%20/g, "+");
                result[encodedKey] = encodedValue;
                return result;
            }, {});
    } catch (error) {
        console.error('❌ sortObject error:', error);
        return {};
    }
}
module.exports = {
    create_payment_url,
    vnpay_return,
}