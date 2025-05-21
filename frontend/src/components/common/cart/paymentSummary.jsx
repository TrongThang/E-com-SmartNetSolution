import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import axios from "axios";
import Swal from 'sweetalert2';
import { useAuth } from "@/contexts/AuthContext";
import axiosPublic from "@/apis/clients/public.client";

export default function PaymentSummary() {
    const navigate = useNavigate();
    const { state, totalItems, totalAmount, getItemSelected } = useCart(); // Thay đổi ở đây
    const { user } = useAuth();

    const checkCheckout = async () => {
        if (!user) {
            await Swal.fire({
                title: 'Thông báo',
                text: 'Bạn cần đăng nhập để thanh toán giỏ hàng!',
                icon: 'error',
                confirmButtonText: 'Đã hiểu!',
            });
            return;
        }

        try {
            console.log(getItemSelected())
            const response = await axiosPublic.post('product/check-list-info', {
                products: getItemSelected() // Thay đổi ở đây
            });

            if (response.status_code === 200) {
                navigate("/checkout");
            } else {
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