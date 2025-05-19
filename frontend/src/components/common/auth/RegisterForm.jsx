"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { AtSign, KeyRound, Loader2, Phone, User, UserCheck } from "lucide-react"

export default function RegisterForm({ onSuccess }) {
    const { register } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [registerForm, setRegisterForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
    })

    const handleRegister = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (registerForm.password !== registerForm.confirmPassword) {
            toast.error("Lỗi", { description: "Mật khẩu xác nhận không khớp" })
            setIsLoading(false)
            return
        }

        try {
            const result = await register({
                username: registerForm.username,
                password: registerForm.password,
                firstName: registerForm.firstName,
                lastName: registerForm.lastName,
                phone: registerForm.phone,
                email: registerForm.email,
            })

            if (result.success) {
                toast.success("Đăng ký thành công", { description: "Vui lòng đăng nhập để tiếp tục" })
                onSuccess?.()
            } else {
                toast.error("Đăng ký thất bại", { description: result.message })
            }
        } catch {
            toast.error("Lỗi", { description: "Có lỗi xảy ra khi đăng ký" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleRegister} className="space-y-4">
            {/* Họ và Tên */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <User size={16} />
                    </div>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Họ"
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm((prev) => ({ ...prev, firstName: e.target.value }))}
                    />
                </div>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <UserCheck size={16} />
                    </div>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Tên"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm((prev) => ({ ...prev, lastName: e.target.value }))}
                    />
                </div>
            </div>

            {/* Tên tài khoản */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <AtSign size={16} />
                </div>
                <input
                    id="register-username"
                    name="username"
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Tên tài khoản"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, username: e.target.value }))}
                />
            </div>

            {/* Email */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mail"
                    >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                </div>
                <input
                    id="register-email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                />
            </div>

            {/* Số điện thoại */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={16} />
                </div>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Số điện thoại"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
            </div>

            {/* Mật khẩu */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <KeyRound size={16} />
                </div>
                <input
                    id="register-password"
                    name="password"
                    type="password"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Mật khẩu"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                />
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <KeyRound size={16} />
                </div>
                <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Xác nhận mật khẩu"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                />
            </div>

            {/* Nút đăng ký */}
            <Button
                type="submit"
                className="mt-2 w-full bg-blue-600 py-2.5 font-medium text-white shadow-md transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Đang xử lý...
                    </span>
                ) : (
                    "Đăng ký"
                )}
            </Button>
        </form>
    )
}
