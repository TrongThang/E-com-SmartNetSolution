import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Phone, MapPin, Calendar, CreditCard, Package, Truck, Gift, FileText, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosPublic from '@/apis/clients/public.client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderData = async () => {
            const response = await axiosPublic.get(`/order/admin/detail/${id}`);
            setOrderData(response.data.data[0]);    
            setLoading(false);
        };
        fetchOrderData();
    }, [id]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            preparing: 'bg-blue-100 text-blue-800 border-blue-200',
            shipping: 'bg-purple-100 text-purple-800 border-purple-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            canceled: 'bg-red-100 text-red-800 border-red-200',
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusText = (status) => {
        const statusText = {
            pending: 'Chờ xử lý',
            preparing: 'Đang chuẩn bị',
            shipping: 'Đang giao hàng',
            delivered: 'Đã giao hàng',
            completed: 'Hoàn thành',
            canceled: 'Đã hủy'
        };
        return statusText[status] || status;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'preparing':
            case 'shipping':
                return <Clock className="w-4 h-4" />;
            case 'canceled':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };


    if (loading) {
        return <div className="flex justify-center items-center h-screen text-blue-500 font-bold">
            <Loader2 className="w-20 h-20 animate-spin" />
        </div>
    }
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button className="p-2 hover:bg-blue-500 rounded-lg transition-colors" onClick={() => navigate('/admin/orders')}>
                                <ArrowLeft className="w-5 h-5" /> Quay lại
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                                <p className="text-gray-600">Mã đơn: {orderData.id}</p>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full border flex items-center space-x-2 ${getStatusColor(orderData.status)}`}>
                            {getStatusIcon(orderData.status)}
                            <span className="font-medium">{getStatusText(orderData.status)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Information */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Thông tin đơn hàng
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Nhân viên bán hàng</p>
                                                <p className="font-medium">{orderData.saler_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Truck className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Shipper</p>
                                                <p className="font-medium">{orderData.shipper_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Ngày xuất</p>
                                                <p className="font-medium">{formatDate(orderData.export_date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <CreditCard className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                                                <p className="font-medium">{orderData.payment_method}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Package className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Nền tảng</p>
                                                <p className="font-medium">{orderData.platform_order}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {orderData.note && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Ghi chú đơn hàng:</p>
                                        <p className="text-blue-800">{orderData.note}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Thông tin khách hàng
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Tên khách hàng</p>
                                        <p className="font-medium text-lg">{orderData.customer_name}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Số điện thoại</p>
                                            <p className="font-medium">{orderData.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                                            <p className="font-medium">{orderData.address}</p>
                                            <p className="text-sm text-gray-500 mt-1">Người nhận: {orderData.name_recipient}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <Package className="w-5 h-5 mr-2" />
                                    Sản phẩm ({orderData.products.length})
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {orderData.products.map((product, index) => (
                                    <div key={index} className="p-6">
                                        <div className="flex space-x-4">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-20 h-20 rounded-lg object-cover border"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900 flex items-center">
                                                            {product.name}
                                                            {product.is_gift && (
                                                                <Gift className="w-4 h-4 ml-2 text-red-500" />
                                                            )}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Số lượng: {product.quantity} {product.unit}
                                                        </p>
                                                        {product.note && (
                                                            <p className="text-sm text-blue-600 mt-1">{product.note}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-900">{formatCurrency(product.amount)}</p>
                                                        {product.discount > 0 && (
                                                            <p className="text-sm text-red-500">
                                                                Giảm: {formatCurrency(product.discount)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Ngày giao hàng:</p>
                                                        <p className="font-medium">{formatDate(product.delivery_date)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Ngày nhận hàng:</p>
                                                        <p className="font-medium">{product.receiving_date ? formatDate(product.receiving_date) : <Badge className="bg-red-500 text-white">Chưa nhận hàng</Badge>}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Tổng kết đơn hàng</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tổng tiền hàng:</span>
                                    <span className="font-medium">{formatCurrency(orderData.total_import_money)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Giảm giá:</span>
                                    <span className="font-medium text-red-500">-{formatCurrency(orderData.discount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">VAT:</span>
                                    <span className="font-medium">{formatCurrency(orderData.vat)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Phí vận chuyển:</span>
                                    <span className="font-medium">{formatCurrency(orderData.shipping_fee)}</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold">Tổng cộng:</span>
                                        <span className="text-lg font-bold text-blue-600">{formatCurrency(orderData.amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Thao tác</h3>
                            <div className="space-y-3">
                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    In hóa đơn
                                </button>
                                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    Xuất Excel
                                </button>
                                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    Gửi email khách hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;