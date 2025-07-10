import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import axiosPrivate from "@/apis/clients/private.client";

export default function AddressInfo() {
    const { customer } = useCart();
    const [address, setAddress] = useState(null);

    const fetchDataCustomer = async () => {
        try {
            const response = await axiosPrivate.get(`/address-book/${customer.id}`);
            if (!response.ok) {
                throw new Error("Lỗi lấy dữ liệu từ khách hàng");
            }
            const result = await response.json();
            const defaultAddress = result.data.find((address) => address.isDefault === true);
            setAddress(defaultAddress || null);
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };
    
    useEffect(() => {
        if (customer?.id) {
            fetchDataCustomer();
        }
    }, [customer?.id]);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
            
            <div className="space-y-4">
                <div>
                    <span className="font-medium">Người nhận:</span>
                    <span className="ml-2">{customer?.surname} {customer?.lastName}</span>
                </div>

                {address ? (
                    <div>
                        <span className="font-medium">Địa chỉ:</span>
                        <span className="ml-2">
                            {address.street}, {address.ward}, {address.district}, {address.city}
                        </span>
                        <Link 
                            to="/profile/address" 
                            className="ml-2 text-blue-600 hover:underline"
                        >
                            Thay đổi
                        </Link>
                    </div>
                ) : (
                    <div className="text-red-500">
                        Bạn chưa thiết lập địa chỉ mặc định
                        <Link 
                            to="/profile/address" 
                            className="ml-2 text-blue-600 hover:underline"
                        >
                            Thiết lập
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}