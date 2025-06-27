import Swal from "sweetalert2"
import axiosPublic from "@/apis/clients/public.client"

// ============= PLATFORM DETECTION =============
function detectPlatform() {
    // Kiểm tra nếu đang chạy trong mobile app
    if (window.ReactNativeWebView || window.webkit?.messageHandlers) {
        return 'mobile';
    }
    
    // Kiểm tra User Agent
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        return 'mobile';
    }
    
    return 'web';
}

// ============= CUSTOM RETURN URL LOGIC =============
function getCustomReturnUrl() {
    const platform = detectPlatform();
    const mobileAppScheme = process.env.REACT_APP_MOBILE_SCHEME || 'myapp';
    
    switch (platform) {
        case 'mobile':
            return `${mobileAppScheme}://payment`;
        case 'web':
        default:
            return null; // Sử dụng default từ backend
    }
}

const handleVnpayPayment = async (amount, bankCode, customReturnUrl = null) => {
    try {
        const platform = detectPlatform();
        const returnUrl = customReturnUrl || getCustomReturnUrl();
        
        const requestData = {
            amount: amount,
            bankCode: bankCode || "VNBANK",
            platform: platform,
            ...(returnUrl && { returnUrl: returnUrl })
        };

        console.log('🚀 VNPay Payment Request:', {
            amount,
            bankCode,
            platform,
            returnUrl,
            userAgent: navigator.userAgent
        });

        const response = await axiosPublic.post('http://localhost:8081/api/order/create_payment_url', requestData);

        console.log('✅ VNPay Response:', response);

        if (response.status_code === 200) {
            console.log(`🔗 Payment URL created: ${response.paymentUrl}`);
            console.log(`🎯 Return URL: ${response.returnUrl}`);
            console.log(`📱 Platform: ${response.platform}`);
            
            // Redirect đến URL thanh toán VNPay
            window.location.href = response.paymentUrl;
        } else {
            throw new Error('Không thể tạo URL thanh toán VNPay');
        }
    } catch (error) {
        console.error('❌ VNPay Payment Error:', error);
        await Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể tạo URL thanh toán VNPay. Vui lòng thử lại.',
            icon: 'error',
        });
    }
};

// ============= EXPORT FUNCTIONS =============
export { detectPlatform, getCustomReturnUrl };
export default handleVnpayPayment;