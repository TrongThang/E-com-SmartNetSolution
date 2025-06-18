"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import Swal from "sweetalert2"


export default function ChangePassword() {
    const navigate = useNavigate();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const { changePassword } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        // Clear error when typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }

        let isValid = true

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại"
            isValid = false
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu mới"
            isValid = false
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự"
            isValid = false
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới"
            isValid = false
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (validateForm()) {

            setLoading(true);
            try {
                const result = await changePassword(formData.currentPassword, formData.newPassword, formData.confirmPassword);
                if (result.success) {
                    setTimeout(() => {
                        setIsSuccess(true)
                    }, 500)
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Đổi mật khẩu thất bại',
                        text: result.message,
                    })
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Đổi mật khẩu thất bại',
                    text: error.message,
                })
            } finally {
                setLoading(false);
            }
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg border-0">
                    <CardHeader className="bg-blue-500 text-white text-center py-6">
                        <CardTitle className="text-xl font-bold">Đổi mật khẩu thành công</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 bg-white">
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <p className="text-center text-gray-700 text-lg">
                                Mật khẩu của bạn đã được thay đổi thành công. Vui lòng sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.
                            </p>
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 text-lg font-medium"
                            onClick={() => navigate("/admin/profile")}>
                                Quay lại trang hồ sơ
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl">
                    <div className="flex items-center">
                        <Link to="/admin/profile" className="mr-4">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Đổi mật khẩu</h1>
                            <p className="text-gray-600 mt-1 text-sm">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6">
                <div className="">
                    <Card className="shadow-lg border-0">
                        <CardHeader className="bg-blue-500 text-white py-6">
                            <CardTitle className="text-xl font-bold">Thay đổi mật khẩu</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 bg-white">
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                {/* Current Password */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="currentPassword"
                                        className="flex items-center space-x-3 text-sm font-semibold text-gray-700"
                                    >
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Lock className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span>Mật khẩu hiện tại</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={formData.currentPassword}
                                            onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                                            className={`w-full h-12 border-2 ${errors.currentPassword ? "border-red-500" : "border-gray-200 focus:border-blue-500"
                                                } rounded-lg text-gray-900 pr-12`}
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            )}
                                            <span className="sr-only">{showCurrentPassword ? "Hide password" : "Show password"}</span>
                                        </Button>
                                    </div>
                                    {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
                                </div>

                                {/* New Password */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="newPassword"
                                        className="flex items-center space-x-3 text-sm font-semibold text-gray-700"
                                    >
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Lock className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span>Mật khẩu mới</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={formData.newPassword}
                                            onChange={(e) => handleInputChange("newPassword", e.target.value)}
                                            className={`w-full h-12 border-2 ${errors.newPassword ? "border-red-500" : "border-gray-200 focus:border-blue-500"
                                                } rounded-lg text-gray-900 pr-12`}
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            )}
                                            <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
                                        </Button>
                                    </div>
                                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="confirmPassword"
                                        className="flex items-center space-x-3 text-sm font-semibold text-gray-700"
                                    >
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Lock className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span>Xác nhận mật khẩu mới</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                            className={`w-full h-12 border-2 ${errors.confirmPassword ? "border-red-500" : "border-gray-200 focus:border-blue-500"
                                                } rounded-lg text-gray-900 pr-12`}
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            )}
                                            <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                                        </Button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-medium mt-8"
                                    disabled={loading}
                                >
                                    {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                                    Đang gửi mã...
                                                </span>
                                            ) : (
                                                "XÁC NHẬN"
                                            )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}