"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { AtSign, KeyRound, Loader2, Mail, Lock } from 'lucide-react'
import axios from "axios"

export default function LoginForm({ onSuccess }) {
  const { login, sendOtp, verifyOtp, loginEmployee } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState("email") // email, otp, newPassword
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('vafo ddnawg nhap')
    setIsLoading(true)
    try {
      const result = await loginEmployee(loginForm.username, loginForm.password)
      if (result.success) {
        toast.success("Đăng nhập thành công", { description: "Chào mừng bạn quay trở lại!" })
        onSuccess?.()
      } else {
        toast.error("Đăng nhập thất bại", { description: result.message })
      }
    } catch (error) {
      toast.error("Lỗi", { description: "Có lỗi xảy ra khi đăng nhập" })
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý gửi OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    const result = await sendOtp(forgotPasswordForm.email)
    if (result.success) {
      toast.success("Mã OTP đã được gửi đến email của bạn", { description: "Vui lòng kiểm tra email để xác minh." })
    }
  }

  // Xử lý xác minh OTP và đặt lại mật khẩu
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    const result = await verifyOtp(forgotPasswordForm.email, forgotPasswordForm.otp)
    if (result.success) {
      toast.success("Mật khẩu đã được đặt lại", { description: "Bạn có thể đăng nhập với mật khẩu mới." })
    }
  }

  // Xử lý quay lại bước trước trong quy trình quên mật khẩu
  const handleBack = () => {
    if (forgotPasswordStep === "otp") {
      setForgotPasswordStep("email")
    } else if (forgotPasswordStep === "newPassword") {
      setForgotPasswordStep("otp")
    }
  }

  return (
    <>
      {/* Form đăng nhập */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-4">
          {/* Username input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <AtSign size={18} />
            </div>
            <input
              id="login-username"
              name="username"
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Tên tài khoản"
              value={loginForm.username}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
            />
          </div>

          {/* Password input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <KeyRound size={18} />
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Mật khẩu"
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>
        </div>

        {/* Remember me and Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
              className="h-4 w-4 border-gray-300 text-blue-500"
            />
            <label htmlFor="remember-me" className="text-sm text-gray-600">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-blue-500 hover:text-blue-700"
            onClick={() => setShowForgotPassword(true)}
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Login button */}
        <Button
          type="submit"
          className="w-full bg-blue-600 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 size={18} className="mr-2 animate-spin" />
              Đang xử lý...
            </span>
          ) : (
            "Đăng nhập"
          )}
        </Button>

        {/* Social login options */}
        <div className="relative mt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Hoặc đăng nhập với</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg className="mr-2 h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>
      </form>

      {/* Modal Quên mật khẩu */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Quên mật khẩu</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowForgotPassword(false)
                  setForgotPasswordStep("email")
                  setForgotPasswordForm({ email: "", otp: "", newPassword: "", confirmPassword: "" })
                }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {forgotPasswordStep === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Nhập email của bạn"
                    value={forgotPasswordForm.email}
                    onChange={(e) => setForgotPasswordForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Đang gửi...
                    </span>
                  ) : (
                    "Gửi mã OTP"
                  )}
                </Button>
              </form>
            )}

            {forgotPasswordStep === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Nhập mã OTP"
                    value={forgotPasswordForm.otp}
                    onChange={(e) => setForgotPasswordForm((prev) => ({ ...prev, otp: e.target.value }))}
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Mật khẩu mới"
                    value={forgotPasswordForm.newPassword}
                    onChange={(e) => setForgotPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Xác nhận mật khẩu"
                    value={forgotPasswordForm.confirmPassword}
                    onChange={(e) => setForgotPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Đang xử lý...
                      </span>
                    ) : (
                      "Xác minh và đặt lại"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}