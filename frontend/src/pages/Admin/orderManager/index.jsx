"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Badge, PackageCheck, Plus, Shapes } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axiosPublic from "@/apis/clients/public.client"
import RoleTable from "@/components/common/table/RoleTable"
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"
import OrderTable from "@/components/common/table/OrderTable"
import { ORDER_STATUS } from "@/constants/status.constants"
import ReactDOM from 'react-dom/client';

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
    const [loading, setLoading] = useState(true)
    const [selectedIds, setSelectedIds] = useState([]);
    const [isAllSelectedPendingConfirm, setIsAllSelectedPendingConfirm] = useState(true)


    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        const selectedOrders = orders.filter(order => selectedIds.includes(order.id));
        const isAllPending = selectedOrders.length > 0 && selectedOrders.every(order => order.status === ORDER_STATUS.PENDING);
        setIsAllSelectedPendingConfirm(isAllPending);
    }, [selectedIds])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const response = await axiosPublic.get("/order/admin")
            console.log('response', response)
            if (response.status_code === 200) {
                setOrders(response.data.data)
            }
        } catch (error) {
            toast.error("Không thể tải danh sách đơn hàng")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleView = (order) => {
        // Chuyển hướng đến trang quản lý quyền
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
                        // Cập nhật lại danh sách
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
        // Chuyển hướng đến trang chỉnh sửa đơn hàng
        navigate(`/admin/order/edit/${order.id}`)
    }

    const confirmDelete = async () => {

    }

    const handleConfirmOrder = async () => {
        try {
            const result = await Swal.fire({
                title: `Bạn có chắc chắn muốn xác nhận các đơn hàng [ ${selectedIds.join(', ')} ]?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            })

            if (!result.isConfirmed) return

            const response = await axiosPublic.patch("/order/admin/respond-orders", { orderIds: selectedIds })

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

                // Mount React component vào container
                ReactDOM.createRoot(container).render(<ErrorList errors={response.data} />);
                Swal.fire({
                    title: 'Xác nhận đơn hàng thất bại',
                    icon: 'error',
                    // width: '800px',
                    html: container,
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#3085d6',
                    cancelButtonText: 'Hủy bỏ',
                    cancelButtonColor: '#d33',
                })
            }
        } catch (error) {
            console.log('error', error)
            Swal.fire({
                title: 'Có lỗi xảy ra khi xác nhận đơn hàng',
                icon: 'error',
                text: error.message,
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#3085d6',
            })
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-[400px] w-full" />
            </div>
        )
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
                    <Button disabled={!isAllSelectedPendingConfirm} className="bg-blue-500 hover:bg-blue-600" onClick={handleConfirmOrder}>
                        <PackageCheck className="mr-2 h-4 w-4" />
                        Xác nhận đơn hàng
                    </Button>
                    <Button asChild className="bg-green-500 hover:bg-green-600">
                        <Link to="/admin/orders/create">
                            <span className="flex items-center">
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo đơn hàng mới
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>

            <OrderTable
                orders={orders}
                onModifyPermission={handleView}
                onDelete={handleDelete}
                onEdit={handleEdit}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                onView={handleView}
            />
        </div>
    )
}