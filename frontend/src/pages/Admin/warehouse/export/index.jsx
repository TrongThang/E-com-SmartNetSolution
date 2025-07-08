"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axiosPublic from "@/apis/clients/public.client"
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"
import ExportWarehouseTable from "@/components/common/table/ExportWarehouseTable"

export default function ExportWarehousePage() {
    const [exportWarehouse, setExportWarehouse] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchExportWarehouse()
    }, [])

    const fetchExportWarehouse = async () => {
        setLoading(true)
        try {
            const sort = "export_warehouse.created_at"
            const order = "desc"
            const response = await axiosPublic.get("/export-warehouse", {
                params: {
                    sort,
                    order
                }
            })
            console.log('response', response)
            if (response.status_code === 200) {
                setExportWarehouse(response.data.data)
            }
        } catch (error) {
            toast.error("Không thể tải danh sách đơn hàng")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleView = (role) => {
        // Chuyển hướng đến trang quản lý quyền
        navigate(`/admin/warehouses/export/detail/${role.id}`)
    }

    const handleDelete = async(exportWarehouse) => {
        Swal.fire({ 
            title: `Bạn có chắc chắn muốn xóa đơn hàng ${exportWarehouse.id}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy bỏ',
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!exportWarehouse) return

                try {
                    const response = await axiosPublic.delete(`/export-warehouse/${exportWarehouse.id}`)
                    if (response.status_code === 200) {
                        toast.success("Xóa đơn hàng thành công")
                        // Cập nhật lại danh sách
                        setExportWarehouse(exportWarehouse.filter(item => item.id !== exportWarehouse.id))
                    } else {
                        toast.error(response.message || "Không thể xóa đơn hàng")
                    }
                } catch (error) {
                    toast.error(error.message || "Có lỗi xảy ra khi xóa đơn hàng")
                    console.error(error)
                } finally {
                    setDeleteDialogOpen(false)
                    setSelectedRole(null)
                }
            }
        })
    }

    const handleEdit = (exportWarehouse) => {
        // Chuyển hướng đến trang chỉnh sửa đơn hàng
        navigate(`/admin/warehouse/export/edit/${exportWarehouse.id}`)
    }

    const confirmDelete = async () => {

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
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng xuất kho</h1>
                    <p className="text-muted-foreground">
                        Quản lý và xử lý đơn hàng xuất kho trong hệ thống
                    </p>
                </div>
                <Button asChild>
                    <Link to="/admin/warehouses/export/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo phiếu xuất kho mới
                    </Link>
                </Button>
            </div>

            <ExportWarehouseTable
                exportWarehouse={exportWarehouse}
                onModifyPermission={handleView} 
                onDelete={handleDelete}
                onEdit={handleEdit}
                onView={handleView}
            />
        </div>
    )
}
