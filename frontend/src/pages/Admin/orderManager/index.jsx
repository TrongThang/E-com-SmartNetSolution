"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PackageCheck, Shapes, Filter, TruckElectric, CheckCircle, Clock, AlertTriangle, FolderClock, PackageSearch, Truck, Handshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import axiosPublic from "@/apis/clients/public.client"
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"
import OrderTable from "@/components/common/Table/OrderTable"
import { ORDER_STATUS } from "@/constants/status.constants"
import ReactDOM from 'react-dom/client';
import axiosPrivate from "@/apis/clients/private.client"
import { Input } from "@/components/ui/input"
import DeliveryEmployeePopup from "@/components/common/order/DeliveryEmployeePopup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";

function ErrorList({ errors }) {
    return (
        <div>
            {errors.map((error, index) => {
                if (error.type === 'product_stock_not_enough') {
                    return (
                        <div key={index} style={{ color: 'red', display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <PackageCheck style={{ marginRight: 1, width: 50, height: 50 }} />
                            <p>{error.message}</p>
                        </div>
                    );
                }
                return (
                    <div key={index} style={{ color: 'red', display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        <Shapes style={{ marginRight: 1, width: 50, height: 50 }} />
                        <p>{error.message}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default function OrderManager() {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedIds, setSelectedIds] = useState([]);
    const [isAllSelectedPendingConfirm, setIsAllSelectedPendingConfirm] = useState(true)
    const [isAllSelectedPendingShipper, setIsAllSelectedPendingShipper] = useState(true)
    const [statusFilter, setStatusFilter] = useState("all")
    const [searchAddress, setSearchAddress] = useState("");
    const [showAssignPopup, setShowAssignPopup] = useState(false);
    const [selectedOrderIdsForAssign, setSelectedOrderIdsForAssign] = useState([]);
    const [productSummary, setProductSummary] = useState([]);
    const [cardAnalysis, setCardAnalysis] = useState({});

    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        let filtered = orders;

        // Filter theo status
        if (statusFilter !== "all") {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Filter theo địa chỉ
        if (searchAddress.trim()) {
            filtered = filtered.filter(order =>
                order.address?.toLowerCase().includes(searchAddress.toLowerCase())
            );
        }

        setFilteredOrders(filtered);
    }, [orders, statusFilter, searchAddress])

    useEffect(() => {
        const selectedOrders = filteredOrders.filter(order => selectedIds.includes(order.id));
        const isAllPending = selectedOrders.length > 0 && selectedOrders.some(order => order.status === ORDER_STATUS.PENDING);
        setIsAllSelectedPendingConfirm(isAllPending);
        const isAllPendingShipper = selectedOrders.length > 0 && selectedOrders.some(order =>
            order.status === ORDER_STATUS.PENDING_SHIPPING
            || order.status === ORDER_STATUS.PENDING
            || order.status === ORDER_STATUS.PREPARING
        );
        setIsAllSelectedPendingShipper(isAllPendingShipper);

        if (selectedIds.length === 0) {
            setProductSummary([]);
            return;
        }

        const summary = {};
        const allSelectedOrders = orders.filter(order => selectedIds.includes(order.id));

        for (const order of allSelectedOrders) {
            if (order.status === ORDER_STATUS.PENDING) {
                for (const product of order.products) {
                    if (!summary[product.id]) {
                        summary[product.id] = {
                            id: product.id,
                            name: product.name,
                            total_stock: product.total_stock || 0,
                            selected_quantity: 0,
                        };
                    }
                    summary[product.id].selected_quantity += product.quantity;
                }
            }
        }

        setProductSummary(Object.values(summary));

    }, [selectedIds, filteredOrders, orders])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const response = await axiosPublic.get("/order/admin")
            if (response.status_code === 200) {
                setOrders(response.data.data)
                setCardAnalysis(response.data.cardAnalysis)
            }
        } catch (error) {
            toast.error("Không thể tải danh sách đơn hàng")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const getSelectedOrdersByStatus = (statuses) => {
        return selectedIds?.filter(id => statuses.includes(orders.find(order => order.id === id)?.status)) || [];
    };

    const getShipperCount = () => {
        return getSelectedOrdersByStatus([
            ORDER_STATUS.PENDING_SHIPPING,
            ORDER_STATUS.PENDING,
            ORDER_STATUS.PREPARING
        ])?.length || 0;
    };

    const getConfirmCount = () => {
        return getSelectedOrdersByStatus([
            ORDER_STATUS.PENDING
        ])?.length || 0;
    };


    const handleView = (order) => {
        navigate(`/admin/orders/detail/${order.id}`)
    }

    const handleDelete = async (order) => {
        Swal.fire({
            title: `Bạn có chắc chắn muốn xóa đơn hàng ${order.id}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy bỏ',
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!order) return

                try {
                    const response = await axiosPublic.delete(`/order/${order.id}`)
                    if (response.status_code === 200) {
                        toast.success("Xóa đơn hàng thành công")
                        setOrders(orders.filter(item => item.id !== order.id))
                    } else {
                        toast.error(response.message || "Không thể xóa đơn hàng")
                    }
                } catch (error) {
                    toast.error(error.message || "Có lỗi xảy ra khi xóa đơn hàng")
                    console.error(error)
                }
            }
        })
    }

    const handleEdit = (order) => {
        navigate(`/admin/order/edit/${order.id}`)
    }

    const handleConfirmOrder = async () => {
        try {

            const selectedOrders = getSelectedOrdersByStatus([
                ORDER_STATUS.PENDING,
            ])

            const result = await Swal.fire({
                title: `Bạn có chắc chắn muốn xác nhận các đơn hàng [ <span class="text-green-500">${selectedOrders.map(order => order).join(', ')}</span> ]?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            })

            if (!result.isConfirmed) return

            const response = await axiosPublic.patch("/order/admin/respond-orders", { orderIds: selectedOrders })

            if (response.status_code === 200) {
                Swal.fire({
                    title: 'Xác nhận đơn hàng thành công',
                    icon: 'success',
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#3085d6',
                })
                fetchOrders()
            } else {
                const container = document.createElement('div');
                ReactDOM.createRoot(container).render(<ErrorList errors={response.data} />);
                Swal.fire({
                    title: 'Xác nhận đơn hàng thất bại',
                    icon: 'error',
                    html: container,
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#3085d6',
                    cancelButtonText: 'Hủy bỏ',
                    cancelButtonColor: '#d33',
                })
            }
        } catch (error) {
            Swal.fire({
                title: 'Có lỗi xảy ra khi xác nhận đơn hàng',
                icon: 'error',
                text: error.message,
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#3085d6',
            })
        }
    }

    const clearFilter = () => {
        setStatusFilter("all")
        setSearchAddress("")
        setSelectedIds([])
    }

    const handleAssignEmployee = async (employee, orderIds) => {
        try {
            const response = await axiosPublic.patch("/order/admin/assign-shipper", { orderIds, employeeId: employee.id })
            if (response.status_code === 200) {
                Swal.fire({
                    title: 'Chỉ định nhân viên giao hàng thành công',
                    icon: 'success',
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#3085d6',
                })
                setShowAssignPopup(false)
                fetchOrders()
            } else {
                Swal.fire({
                    title: 'Chỉ định nhân viên giao hàng thất bại',
                    icon: 'error',
                    text: response.errors[0].message,
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#3085d6',
                })
            }
        } catch (error) {
            Swal.fire({
                title: 'Có lỗi xảy ra khi chỉ định nhân viên giao hàng',
                icon: 'error',
                text: error.message,
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#3085d6',
            })
            console.error(error)
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
                    <p className="text-muted-foreground">
                        Quản lý và xử lý đơn hàng trong hệ thống
                    </p>
                </div>
                <div className="flex space-x-2 ml-auto">
                    <Button
                        disabled={!isAllSelectedPendingShipper}
                        className="bg-rose-600 hover:bg-rose-700"
                        onClick={() => {
                            setSelectedOrderIdsForAssign(getSelectedOrdersByStatus([
                                ORDER_STATUS.PENDING_SHIPPING,
                                ORDER_STATUS.PENDING,
                                ORDER_STATUS.PREPARING
                            ]));
                            setShowAssignPopup(true);
                        }}
                    >
                        <TruckElectric className="mr-2 h-4 w-4" />
                        <span className="text-yellow-400"> ( {getShipperCount()} ) </span>
                        Chỉ định Shipper
                    </Button>
                    <Button disabled={!isAllSelectedPendingConfirm} className="bg-blue-500 hover:bg-blue-600" onClick={handleConfirmOrder}>
                        <PackageCheck className="mr-2 h-4 w-4" />
                        <span className="text-yellow-400"> ( {getConfirmCount()} ) </span>
                        Xác nhận đơn hàng
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chờ xác nhận</CardTitle>
                        <FolderClock className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{cardAnalysis.total_pending_orders}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang chuẩn bị</CardTitle>
                        <PackageSearch className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {cardAnalysis.total_preparing_orders}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chờ & Đang giao hàng</CardTitle>
                        <Truck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {cardAnalysis.total_processing_orders}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã giao hàng</CardTitle>
                        <Handshake className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {cardAnalysis.total_completed_orders}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
                        </div>

                        {/* Thêm input tìm kiếm địa chỉ */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Địa chỉ:</span>
                            <Input
                                placeholder="Nhập địa chỉ cần tìm..."
                                value={searchAddress}
                                onChange={(e) => setSearchAddress(e.target.value)}
                                className="w-[250px]"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Trạng thái:</span>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả đơn hàng</SelectItem>
                                    <SelectItem value={ORDER_STATUS.PENDING_PAYMENT}>Chờ thanh toán</SelectItem>
                                    <SelectItem value={ORDER_STATUS.PENDING}>Chờ xác nhận</SelectItem>
                                    <SelectItem value={ORDER_STATUS.PREPARING}>Đang chuẩn bị</SelectItem>
                                    <SelectItem value={ORDER_STATUS.PENDING_SHIPPING}>Chờ giao hàng</SelectItem>
                                    <SelectItem value={ORDER_STATUS.SHIPPING}>Đang giao hàng</SelectItem>
                                    <SelectItem value={ORDER_STATUS.DELIVERED}>Đã giao hàng</SelectItem>
                                    <SelectItem value={ORDER_STATUS.CANCELLED}>Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Hiển thị: <span className="font-medium">{filteredOrders.length}</span> / <span className="font-medium">{orders.length}</span> đơn hàng
                        </span>
                        {(statusFilter !== "all" || searchAddress.trim()) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilter}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Xóa bộ lọc
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {productSummary.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Tổng hợp sản phẩm đã chọn</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {productSummary.map(product => (
                            <div 
                                key={product.id} 
                                className={`p-4 rounded-lg border ${
                                    product.selected_quantity > product.total_stock ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                                }`}
                            >
                                <p className="font-bold text-gray-800 truncate">{product.name}</p>
                                <div className="mt-2 text-sm text-gray-600">
                                    <span>Đã chọn: </span>
                                    <span className="font-semibold">{product.selected_quantity}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span>Tồn kho: </span>
                                    <span className="font-semibold">{product.total_stock}</span>
                                </div>
                                {product.selected_quantity > product.total_stock && (
                                    <p className="text-xs text-red-600 font-bold mt-1 animate-pulse">
                                        Không đủ hàng
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <OrderTable
                orders={filteredOrders}
                onDelete={handleDelete}
                onEdit={handleEdit}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                onView={handleView}
            />
            <DeliveryEmployeePopup
                open={showAssignPopup}
                onClose={() => setShowAssignPopup(false)}
                orderIds={selectedOrderIdsForAssign}
                onAssign={handleAssignEmployee}
            />
        </div>
    )
}
