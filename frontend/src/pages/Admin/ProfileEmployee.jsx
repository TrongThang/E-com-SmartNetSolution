"use client"

import { useEffect, useRef, useState } from "react"
import { User, Mail, Calendar, Edit3, Save, X, Camera, Shield, Loader2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { formatDate } from "@/utils/format"
import ImageCropper from "@/components/common/ImageCropper"
import { toast } from "sonner"
import Swal from "sweetalert2"
import axiosIOTPublic from "@/apis/clients/iot.public.client"

export default function ProfileEmployee() {
    const [isEditing, setIsEditing] = useState(false)
    const { employee, fetchEmployeeInfo } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);
    const [tempImage, setTempImage] = useState(null)
    const [showCropModal, setShowCropModal] = useState(false)
    const [originalImage, setOriginalImage] = useState(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [employeeData, setEmployeeData] = useState({
        username: "",
        surname: "",
        lastname: "",
        birthdate: "",
        phone: "",
        email: "",
        image: "",
    })

    useEffect(() => {
        setEmployeeData(employee.employee);
    }, [employee, refreshKey])

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleCropComplete = (croppedImage) => {
        if (croppedImage === null) {
            // Trường hợp hủy
            setEmployeeData(prev => ({ ...prev, image: originalImage }));
            setTempImage(null);
            setIsEditing(false)
            toast.info("Đã hủy chọn ảnh");
        } else {
            // Trường hợp xác nhận cắt ảnh
            setEmployeeData(prev => ({ ...prev, image: croppedImage }));
            setIsEditing(true)
        }
        setShowCropModal(false);
    };

    const handleInputChange = (field, value) => {
        setEmployeeData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleUpdateEmployee = async () => {
        try {
            setLoading(true)
            delete employeeData.username;
            delete employeeData.fullname;
            const updatedData = {
                ...employeeData,
                birthdate: (employeeData?.birthdate)?.slice(0, 10),
                image: employeeData.image ? employeeData.image : ""
            };
            
            const response = await axiosIOTPublic.patch(`auth/employee/update-profile`, updatedData);
            
            if (response.status_code === 200) {
                setIsEditing(false)
                Swal.fire({
                    title: 'Cập nhật thông tin thành công',
                    icon: 'success',
                    timer: 1500
                })
                await fetchEmployeeInfo();
                await setRefreshKey(prev => prev + 1);
            } else {
                Swal.fire({
                    title: 'Cập nhật thông tin thất bại',
                    icon: 'error',
                    text: response.message,
                })
            }
        } catch (error) {
            console.error('Update User error:', error);
            Swal.fire({
                title: 'Có lỗi xảy ra khi cập nhật thông tin',
                icon: 'error',
                text: error.message || 'Có lỗi xảy ra khi cập nhật thông tin',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setEmployeeData(employee);
        setIsEditing(false);
    }

    const handleImageChange = (e) => {
        setIsEditing(true);
        const file = e.target.files[0];
        if (!file) return;
    
        setOriginalImage(employeeData.image); // Lưu ảnh ban đầu
        const reader = new FileReader();
        reader.onloadend = () => {
            setTempImage(reader.result);
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
                <div className="px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                Thông tin nhân viên
                            </h1>
                            <p className="text-slate-600 mt-2 text-lg">Quản lý và cập nhật thông tin cá nhân</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            {isEditing ? (
                                <>
                                    <Button
                                        onClick={handleUpdateEmployee}
                                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <Loader2 size={18} className="mr-2 animate-spin" />
                                                Đang cập nhật...
                                            </span>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Lưu thay đổi
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="border-slate-300 text-slate-700 hover:bg-slate-50"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Hủy
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    {/* Avatar */}
                                    <div className="relative inline-block mb-6">
                                        <div className="relative">
                                            <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                                                <AvatarImage
                                                    src={
                                                        employeeData?.image && employeeData?.image.trim() !== ""
                                                            ? `${employeeData?.image}`
                                                            : undefined
                                                    }
                                                    alt="Employee Avatar"
                                                />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                                                    {employeeData?.surname?.charAt(0) ?? "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <button 
                                                className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                                onClick={handleAvatarClick}
                                            >
                                                <Camera className="w-5 h-5" />
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                    {/* Name & Username */}
                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            {employeeData?.surname} {employeeData?.lastname}
                                        </h2>
                                        <div className="flex items-center justify-center space-x-2">
                                            <User className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-600">{employee?.username}</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <Mail className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-600">{employeeData?.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Information Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
                            <CardContent className="p-8">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900">Thông tin cá nhân</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Surname */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Họ</Label>
                                        {isEditing ? (
                                            <Input
                                                value={employeeData.surname || ""}
                                                onChange={(e) => handleInputChange("surname", e.target.value)}
                                                className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                                <span className="text-slate-900">{employeeData.surname || "Chưa cập nhật"}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Lastname */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Tên</Label>
                                        {isEditing ? (
                                            <Input
                                                value={employeeData.lastname || ""}
                                                onChange={(e) => handleInputChange("lastname", e.target.value)}
                                                className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                                <span className="text-slate-900">{employeeData.lastname || "Chưa cập nhật"}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Email</Label>
                                        {isEditing ? (
                                            <Input
                                                type="email"
                                                value={employeeData.email || ""}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                                disabled
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                                <span className="text-slate-900">{employeeData.email || "Chưa cập nhật"}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Số điện thoại</Label>
                                        {isEditing ? (
                                            <Input
                                                type="tel"
                                                value={employeeData.phone || ""}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                                <span className="text-slate-900">{employeeData.phone || "Chưa cập nhật"}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Birthdate */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Ngày sinh</Label>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={employeeData.birthdate?.slice(0, 10) || ""}
                                                onChange={(e) => handleInputChange("birthdate", e.target.value)}
                                                className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                                <span className="text-slate-900">
                                                    {employeeData.birthdate ? formatDate(employeeData.birthdate) : "Chưa cập nhật"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security & Actions */}
                        <div className="">
                            {/* Security */}
                            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900">Bảo mật</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <Link to="/admin/profile/change-password">
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                                            >
                                                Đổi mật khẩu
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal cắt ảnh */}
            {showCropModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4">
                        <div className="p-6">
                            <ImageCropper
                                image={tempImage}
                                onCropComplete={handleCropComplete}
                                aspectRatio={5 / 5}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}