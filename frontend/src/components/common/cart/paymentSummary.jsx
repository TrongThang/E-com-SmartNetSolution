import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import axios from "axios";
import Swal from 'sweetalert2';

export default function PaymentSummary() {
    const navigate = useNavigate();
    const { state, totalItems, totalAmount } = useCart(); // Thay đổi ở đây
    const [idCustomer, setIdCustomer] = useState(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.idPerson;
        }
        return null;
    });

    const checkCheckout = async () => {
        if (!idCustomer) {
            await Swal.fire({
                title: 'Thông báo',
                text: 'Bạn cần đăng nhập để thanh toán giỏ hàng!',
                icon: 'error',
                confirmButtonText: 'Đã hiểu!',
            });
            return;
        }

        const filteredCart = state.items.filter(item => // Thay đổi ở đây
            item.status && item.stock >= item.quantity && item.quantity !== 0
        );

        if (filteredCart.length <= 0) {
            await Swal.fire({
                title: 'Thông báo',
                text: 'Không còn sản phẩm nào trong giỏ hàng có thể đáp ứng điều kiện đặt hàng!',
                icon: 'error',
                confirmButtonText: 'Xác nhận',
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/api/device/check-list', {
                products: state.items // Thay đổi ở đây
            });

            if (response.data.errorCode === 0) {
                navigate("/checkout");
            } else if (response.data.errorCode === 3) {
                const { nameDevice, stockDeviceRemaining, quantityInitial } = response.data;
                
                const result = await Swal.fire({
                    title: 'Thông báo',
                    html: `
                        Sản phẩm <b class="text-danger">${nameDevice}</b> mà bạn muốn mua hiện không đủ số lượng bán 
                        (${quantityInitial} / <b class="text-danger">${stockDeviceRemaining}</b> còn lại). 
                        Thanh toán mà không có sản phẩm này?
                    `,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Xác nhận',
                    cancelButtonText: 'Huỷ',
                });

                if (result.isConfirmed) {
                    navigate('/checkout');
                } else {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Error checking out:', error);
            await Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi xử lý đơn hàng',
                icon: 'error',
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 sticky top-4 border ">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                        Tổng cộng <span className="text-red-500">({totalItems})</span> {/* Thay đổi ở đây */}
                    </h3>
                    <span className="text-2xl font-bold text-red-600">
                        {formatCurrency(totalAmount)} {/* Thay đổi ở đây */}
                    </span>
                </div>

                <Button 
                    className="w-full py-3 text-lg bg-blue-500 text-white"
                    onClick={checkCheckout}
                >
                    Thanh toán
                </Button>
            </div>
        </div>
    );
}