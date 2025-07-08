"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    Upload,
    User,
    Calendar,
    Mail,
    Phone,
    UserCheck,
    Briefcase,
    AlertCircle,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import EmployeeApi from "@/apis/modules/employee.api.ts"
import roleApi from "@/apis/modules/role.api.ts"
import Swal from "sweetalert2"
import WarehouseApi from "@/apis/modules/warehouse.api.ts"

export default function AddEmployeeForm() {
    const navigate = useNavigate()
    const [imagePreview, setImagePreview] = useState(null)
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [warehouses, setWarehouses] = useState([])
    const [formData, setFormData] = useState({
        surname: "",
        lastname: "",
        email: "",
        phone: "",
        birthdate: "",
        gender: true, // true = nam, false = nữ  
        status: 1, // 1 = hoạt động, 0 = không hoạt động
        username: "",
        role: -1,
        image: "",
        warehouse_id: -1,
    })

    const validateForm = () => {
        const newErrors = {}
        if (!formData.surname.trim()) {
            newErrors.surname = "Họ không được để trống"
        }

        if (!formData.lastname.trim()) {
            newErrors.lastname = "Tên không được để trống"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống"
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Số điện thoại không được để trống"
        }
        // if (!formData.birthdate) {
        //     newErrors.birthdate = "Ngày sinh không được để trống"
        // }
        if (!formData.image) {
            newErrors.image = "Hình ảnh không được để trống"
        }
        if (!formData.username.trim()) {
            newErrors.username = "Tên đăng nhập không được để trống"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    useEffect(() => {
        fetchDataRole()
        fetchDataWarehouse()
    }, [])

    const fetchDataWarehouse = async () => {

        try {
            const res = await WarehouseApi.list({})
            if (res.status_code === 200) {
                setWarehouses(res.data?.data || [])
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: "Không thể tải danh sách kho hàng. Vui lòng thử lại.",
                    confirmButtonText: "Đóng",
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetchDataRole = async () => {
        setLoading(true)
        try {
            const res = await roleApi.list({})
            if (res.status_code === 200) {
                setRoles(res.data?.data || [])
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: "Không thể tải danh sách vai trò. Vui lòng thử lại.",
                    confirmButtonText: "Đóng",
                })
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Có lỗi xảy ra khi tải vai trò. Vui lòng thử lại.",
                confirmButtonText: "Đóng",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field, value) => {
        console.log(field, value)
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target?.result
                setImagePreview(result)
                setFormData((prev) => ({
                    ...prev,
                    image: result,
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return
        }

        setLoading(true);
        try {
            const res = await EmployeeApi.add(formData);
            if (res.status_code === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Thêm nhân viên thành công",
                    confirmButtonText: "OK",
                }).then(() => {
                    navigate("/admin/employees");
                });
            } else {
                let errorMsg = "Có lỗi xảy ra, vui lòng thử lại.";
                if (res.errors && res.errors.length > 0) {
                    errorMsg = res.errors.map((e) => e.message).join("<br/>");
                } else if (res.message) {
                    errorMsg = res.message;
                }

                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    html: errorMsg,
                    confirmButtonText: "Đóng",
                });
            }
        } catch (err) {
            let errorMsg = "Có lỗi xảy ra, vui lòng thử lại.";
            if (err?.response?.data?.errors && err.response.data.errors.length > 0) {
                errorMsg = err.response.data.errors.map((e) => e.message).join("<br/>");
            } else if (err?.response?.data?.message) {
                errorMsg = err.response.data.message;
            }

            Swal.fire({
                icon: "error",
                title: "Lỗi",
                html: errorMsg,
                confirmButtonText: "Đóng",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="">
                <div className="mb-6">
                    <Link to="/admin/employees" className="text-blue-600 hover:underline">
                        <Button variant="ghost" onClick={() => navigate("/admin/employees")} className="mb-4 p-0 h-auto">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="text-gray-600 hover:text-gray-900">Trở về</span>
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Thêm nhân viên mới</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1">
                            <Card className="h-fit">
                                <CardHeader className="text-center">
                                    <CardTitle className="text-lg flex items-center justify-center gap-2">
                                        <User className="w-5 h-5" />
                                        Hình ảnh nhân viên
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center space-y-4">
                                    <Avatar className="w-40 h-40 border-4 border-gray-200">
                                        <AvatarImage src={imagePreview || ""} className="object-cover" />
                                        <AvatarFallback className="text-3xl bg-gray-100">
                                            {formData.surname.charAt(0) && formData.lastname.charAt(0)
                                                ? formData.surname.charAt(0) + formData.lastname.charAt(0)
                                                : <User className="w-16 h-16 text-gray-400" />}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="w-full space-y-3">
                                        <Label htmlFor="image-upload" className="cursor-pointer block">
                                            <div className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100">
                                                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                                <p className="text-sm text-gray-600 font-medium">Tải ảnh lên</p>
                                                <p className="text-xs text-gray-400">PNG, JPEG (tối đa 10MB)</p>
                                            </div>
                                        </Label>
                                        {errors.image && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.image}
                                            </p>
                                        )}
                                        <Input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        {imagePreview && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setFormData((prev) => ({ ...prev, image: "" }));
                                                }}
                                                className="w-full"
                                            >
                                                Xóa ảnh
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-3 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <UserCheck className="w-5 h-5" />
                                        Thông tin cá nhân
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Họ */}
                                        <div className="space-y-2">
                                            <Label htmlFor="surname" className="text-sm font-medium flex items-center gap-2">
                                                Họ <span className="text-red-500">*</span>
                                            </Label>

                                            <Input
                                                id="surname"
                                                value={formData.surname}
                                                onChange={(e) => handleInputChange("surname", e.target.value)}
                                                placeholder="Nhập họ (VD: Nguyễn)"
                                                className="h-11"
                                            />
                                            {errors.surname && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.surname}
                                                </p>
                                            )}
                                        </div>
                                        {/* Tên */}
                                        <div className="space-y-2">
                                            <Label htmlFor="lastname" className="text-sm font-medium flex items-center gap-2">
                                                Tên  <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="lastname"
                                                value={formData.lastname}
                                                onChange={(e) => handleInputChange("lastname", e.target.value)}
                                                placeholder="Nhập tên (VD: Văn A)"
                                                className="h-11"
                                            />
                                            {errors.lastname && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.lastname}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Tên đăng nhập */}
                                    <div className="space-y-2 grid">
                                        <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                                            Tên đăng nhập <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="username"
                                            value={formData.username}
                                            onChange={(e) => handleInputChange("username", e.target.value)}
                                            placeholder="Nhập tên đăng nhập"
                                            className="h-11"
                                        />
                                        {errors.username && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.username}
                                            </p>
                                        )}
                                    </div>
                                    <Separator />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Gmail.com */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Email <span className="text-red-500">*</span>
                                            </Label>

                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                placeholder="example@company.com"
                                                className="h-11"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                        {/* Số điện thoại */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                Số điện thoại <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                placeholder="0901234567"
                                                className="h-11"
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Ngày sinh */}
                                        <div className="space-y-2">
                                            <Label htmlFor="birthdate" className="text-sm font-medium flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Ngày sinh <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="birthdate"
                                                type="date"
                                                value={formData.birthdate}
                                                onChange={(e) => handleInputChange("birthdate", e.target.value)}
                                                className="h-11"
                                            />
                                        </div>
                                        {/* Giới tính */}
                                        <div className="space-y-2">
                                            <Label htmlFor="gender" className="text-sm font-medium flex items-center gap-2">
                                                Giới tính <span className="text-red-500">*</span>
                                            </Label>

                                            <Select onValueChange={(value) => handleInputChange("gender", value === "true")}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Chọn giới tính" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Nam</SelectItem>
                                                    <SelectItem value="false">Nữ</SelectItem>
                                                </SelectContent>
                                            </Select>

                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Briefcase className="w-5 h-5" />
                                        Thông tin công việc
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* vai trò */}
                                        <div className="space-y-2">
                                            <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                                                Vai trò <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={formData.role}
                                                onValueChange={(value) => handleInputChange("role", parseInt(value))} disabled={loading || roles.length === 0}
                                            >
                                                <SelectTrigger className="h-11 w-full">
                                                    <SelectValue placeholder={loading ? "Đang tải vai trò..." : roles.length === 0 ? "Không có vai trò" : "Chọn vai trò"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.id}>
                                                            {role.role_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {/* trạng thái */}
                                        <div className="space-y-2">
                                            <Label htmlFor="status" className="text-sm font-medium flex items-center gap-2">
                                                Trạng thái <span className="text-red-500">*</span>
                                            </Label>
                                            <Select onValueChange={(value) => handleInputChange("status", parseInt(value))}>
                                                <SelectTrigger className="h-11 w-full">
                                                    <SelectValue placeholder="Chọn trạng thái" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1" Selected>Hoạt động</SelectItem>
                                                    <SelectItem value="0">Không hoạt động</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Kho hàng */}
                                        <div className="space-y-2"> 
                                            <Label htmlFor="warehouse_id" className="text-sm font-medium flex items-center gap-2">
                                                Kho hàng <span className="text-red-500">*</span>
                                            </Label>
                                            <Select onValueChange={(value) => handleInputChange("warehouse_id", parseInt(value))}
                                                value={formData.warehouse_id}
                                            >
                                                <SelectTrigger className="h-11 w-full">
                                                    <SelectValue placeholder="Chọn kho hàng" defaultValue={formData.warehouse_id} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {warehouses.map((warehouse) => (
                                                        <SelectItem key={warehouse.id} value={warehouse.id}>
                                                            {warehouse.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col sm:flex-row justify-end gap-4">
                                <Link to="/admin/employees" className="flex-1 sm:flex-none">
                                    <Button type="button" variant="outline" onClick={() => navigate("/admin/employees")} className="h-11 px-8" disabled={loading}>
                                        Hủy
                                    </Button>
                                </Link>
                                <Button type="submit" className="bg-black hover:bg-gray-800 h-11 px-8" disabled={loading}>
                                    {loading ? "Đang lưu..." : "Lưu"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}