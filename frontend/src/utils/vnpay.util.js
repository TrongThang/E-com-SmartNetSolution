import Swal from "sweetalert2"
import axiosPublic from "@/apis/clients/public.client"

const handleVnpayPayment = async (amount, bankCode) => {
    try {
        const response = await axiosPublic.post('http://localhost:8081/api/order/create_payment_url', {
            amount: amount,
            bankCode: bankCode || "VNBANK",
        });

        console.log('response --- handleVnpayPayment', response)

        if (response.status_code === 200) {
            console.log(`Đã tạo được link thanh toán VnPay: ${response.paymentUrl}`)
            // Redirect đến URL thanh toán VNPay
            window.location.href = response.paymentUrl;
        } else {
            throw new Error('Không thể tạo URL thanh toán VNPay');
        }
    } catch (error) {
        console.error('Lỗi khi tạo URL thanh toán VNPay:', error);
        await Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể tạo URL thanh toán VNPay. Vui lòng thử lại.',
            icon: 'error',
        });
    }
};

export default handleVnpayPayment;