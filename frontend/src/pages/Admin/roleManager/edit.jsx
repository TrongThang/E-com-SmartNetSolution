// frontend/src/pages/Admin/roleManager/edit.jsx
"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import axiosPublic from "@/apis/clients/public.client"

export default function EditRole() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
    })

    // Fetch role data
    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await axiosPublic.get(`/role/detail/${id}`)
                if (response.status_code === 200) {
                    setFormData({
                        name: response.data.name,
                    })
                } else {
                    toast.error("Không thể tải thông tin chức vụ")
                    // navigate("/admin/role")
                }
            } catch (error) {
                console.error(error)
                toast.error("Có lỗi xảy ra khi tải thông tin chức vụ")
                // navigate("/admin/role")
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchRole()
        }
    }, [id, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên chức vụ")
            return
        }

        setSaving(true)
        try {
            const response = await axiosPublic.put(`/role/${id}`, {
                name: formData.name
            })

            if (response.status_code === 200) {
                toast.success("Cập nhật chức vụ thành công")
                navigate("/admin/role")
            } else {
                toast.error(response.message || "Không thể cập nhật chức vụ")
            }
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra khi cập nhật chức vụ")
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <Skeleton className="h-10 w-48" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa chức vụ</h1>
                    <p className="text-muted-foreground">
                        Cập nhật thông tin chức vụ
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin chức vụ</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên chức vụ</Label>
                            <Input
                                id="name"
                                placeholder="Nhập tên chức vụ"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={saving}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/role")}
                                disabled={saving}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Quay lại
                            </Button>
                            <Button 
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600"
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
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}