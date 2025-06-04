"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import axiosPublic from "@/apis/clients/public.client"
import RoleTable from "@/components/common/table/RoleTable"
import { Skeleton } from "@/components/ui/skeleton"
import Swal from "sweetalert2"

export default function RoleManager() {
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        setLoading(true)
        try {
            const response = await axiosPublic.get("/permission/role")
            console.log('response', response)
            if (response.status_code === 200) {
                setRoles(response.data)
            }
        } catch (error) {
            toast.error("Không thể tải danh sách chức vụ")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleView = (role) => {
        // Chuyển hướng đến trang quản lý quyền
        navigate(`/admin/role/permission/${role.id}`)
    }

    const handleDelete = async(role) => {
        Swal.fire({ 
            title: `Bạn có chắc chắn muốn xóa chức vụ ${role.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy bỏ',
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!role) return

                try {
                    const response = await axiosPublic.delete(`/role/${role.id}`)
                    if (response.status_code === 200) {
                        toast.success("Xóa chức vụ thành công")
                        // Cập nhật lại danh sách
                        setRoles(roles.filter(item => item.id !== role.id))
                    } else {
                        toast.error(response.message || "Không thể xóa chức vụ")
                    }
                } catch (error) {
                    toast.error(error.message || "Có lỗi xảy ra khi xóa chức vụ")
                    console.error(error)
                } finally {
                    setDeleteDialogOpen(false)
                    setSelectedRole(null)
                }
            }
        })
    }

    const handleEdit = (role) => {
        // Chuyển hướng đến trang chỉnh sửa chức vụ
        navigate(`/admin/role/edit/${role.id}`)
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
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý chức vụ</h1>
                    <p className="text-muted-foreground">
                        Quản lý và phân quyền cho các chức vụ trong hệ thống
                    </p>
                </div>
                <Button asChild>
                    <Link to="/admin/role/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm chức vụ
                    </Link>
                </Button>
            </div>

            <RoleTable
                roles={roles}
                onModifyPermission={handleView} 
                onDelete={handleDelete}
                onEdit={handleEdit}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa chức vụ "{selectedRole?.name}"? 
                            Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}