// frontend/src/pages/Admin/roleManager/create.jsx
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import axiosPublic from "@/apis/clients/public.client"

export default function CreateRole() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên chức vụ")
            return
        }

        setLoading(true)
        try {

            const response = await axiosPublic.post("/role", {
                name: formData.name
            })

            if (response.status_code === 200) {
                toast.success("Tạo chức vụ thành công")
                // Chuyển hướng đến trang quản lý quyền của chức vụ mới
                navigate(`/admin/role/permission/${response.data.id}`)
            } else {
                toast.error(response.message || "Không thể tạo chức vụ")
            }
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra khi tạo chức vụ")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tạo chức vụ mới</h1>
                    <p className="text-muted-foreground">
                        Thêm chức vụ mới vào hệ thống
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
                                disabled={loading}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/role")}
                                disabled={loading}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Quay lại
                            </Button>
                            <Button 
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Tạo chức vụ
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