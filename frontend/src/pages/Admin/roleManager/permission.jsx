"use client"

import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { CircleAlert, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import axiosPublic from "@/apis/clients/public.client"
import Swal from "sweetalert2"

export default function Permission() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [rolePermission, setRolePermission] = useState([])
    const [listActive, setListActive] = useState([])
    const params = useParams()
    const roleId = params.id

    useEffect(() => {
        const fetchPermissions = async () => {
            setLoading(true)
            try {
                const res = await axiosPublic.get(`/permission/role/detail?role_id=${roleId}`)
                const data = res.data

                if (data) {
                    setRolePermission(data.permissionConfigData)

                    // Khởi tạo danh sách active từ dữ liệu API
                    const initialActive = []
                    data.permissionConfigData.forEach((group) => {
                        group.items.forEach((permission) => {
                            initialActive.push({
                                id: permission.id,
                                active: Boolean(permission.active)
                            })
                        })
                    })

                    setListActive(initialActive)
                }
            } catch (error) {
                console.error(error)
                Swal.fire({
                    title: "Lỗi",
                    text: "Không thể tải dữ liệu quyền",
                    icon: "error",
                })

            } finally {
                setLoading(false)
            }
        }

        if (roleId) fetchPermissions()
    }, [roleId])

    const handleCheckboxChange = (data) => {
        setListActive((prev) => {
            const index = prev.findIndex((p) => Number(p.id) === Number(data.id))
            if (index !== -1) {
                return prev.map((p) => (Number(p.id) === Number(data.id) ? { ...p, active: data.active } : p))
            } else {
                return [...prev, { ...data }]
            }
        })
    }

    const handleSubmit = async () => {
        setSaving(true)
        try {
            const result = await Swal.fire({
                title: "Xác nhận",
                text: "Bạn có chắc chắn muốn cập nhật quyền cho chức vụ này?",
                icon: "warning",
                showCancelButton: true,
            })


            
            if (!result.isConfirmed) {
                setSaving(false)
                return
            }

            const permissionsRequest = listActive.filter(v => v.active).map(v => Number(v.id))

            const response = await axiosPublic.patch(`/permission/modify-permission`, {
                role_id: roleId,
                permissions: permissionsRequest
            })

            if (response.status_code === 200) {
                Swal.fire({
                    title: "Thành công",
                    text: "Cập nhật quyền thành công",
                    icon: "success",
                })
            } else {
                Swal.fire({
                    title: "Lỗi",
                    text: response.errors[0].message || "Có lỗi xảy ra khi cập nhật quyền",
                    icon: "error",
                })
            }   
        } catch (error) {
            Swal.fire({
                title: "Lỗi",
                text: error.message || "Có lỗi xảy ra khi cập nhật quyền",
                icon: "error",
            })
        } finally {
            setSaving(false)
        }
    }

    const isPermissionActive = (permissionId) => {
        console.log('permissionId', permissionId)
        console.log('listActive', listActive.some((item) => Number(item.id) === Number(permissionId) && item.active))
        return listActive.some((item) => Number(item.id) === Number(permissionId) && item.active)
    }

    if (loading) return <Skeleton className="w-full h-full" />

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý quyền</h1>
                    <p className="text-muted-foreground">Phân quyền cho chức vụ</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array(4).fill(0).map((_, index) => (
                        <Card key={index}>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="flex items-start space-x-2">
                                        <Skeleton className="h-4 w-4 mt-1" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {rolePermission.map((group, index) => (
                        <Card key={index}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <CircleAlert className="h-4 w-4 text-orange-500" />
                                    {group.show_in_menu}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {group.items.map((permission) => (
                                    <div key={permission.id} className="flex items-start space-x-2">
                                        <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={isPermissionActive(permission.id)}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange({
                                                    id: permission.id,
                                                    active: Boolean(checked),
                                                })
                                            }
                                        />
                                        <div className="space-y-1">
                                            <Label 
                                                htmlFor={`permission-${permission.id}`} 
                                                className="text-sm font-medium cursor-pointer"
                                            >
                                                {permission.name}
                                            </Label>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="fixed bottom-6 right-6 flex gap-2 z-50">
                <Button variant="outline" asChild>
                    <Link to="/admin/role">Quay lại</Link>
                </Button>
                <Button 
                    className="bg-orange-500 hover:bg-orange-600" 
                    onClick={handleSubmit} 
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Đang lưu...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Lưu thay đổi
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}