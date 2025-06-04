"use client"

import { useEffect, useState } from "react"
import { Bell, ChevronDown, LogOut, Settings, User, Wifi, Thermometer, Shield, Calendar } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Topbar() {
    const [notifications] = useState(3)

    // Dữ liệu mẫu
    const username = "Nguyễn Văn A"
    const role = "Quản trị viên"
    const email = "nguyenvana@smartnet.com"

    const [time, setTime] = useState("")
    const [date, setDate] = useState("")

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()

            const newTime = now.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })

            const newDate = now.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })

            setTime(newTime)
            setDate(newDate)
        }

        updateTime() // chạy lần đầu
        const interval = setInterval(updateTime, 1000)

        return () => clearInterval(interval) // cleanup khi component unmount
    }, [])

    return (
        <div className="h-[10vh] w-full bg-gradient-to-r from-slate-950 to-blue-900 text-slate-100 shadow-md flex items-center justify-between px-4 border-b border-slate-700">
        {/* Left side - Sidebar trigger */}
            <div className="flex items-center gap-4">
                
            </div>
            
            {/* Right side - Time, Notifications, User */}
            <div className="flex items-center gap-4">
                {/* Time Display */}
                <div className="hidden md:flex flex-col items-end text-white">
                    <div className="font-bold text-lg leading-none">{time}</div>
                    <div className="text-xs text-slate-300">{date}</div>
                </div>

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-white"
                        >
                            <Bell className="h-5 w-5" />
                            {notifications > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                >
                                    {notifications}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-white shadow-xl border-0">
                        <div className="p-3 border-b bg-slate-50">
                            <h3 className="font-semibold text-slate-900">Thông báo hệ thống</h3>
                            <p className="text-sm text-slate-600">Bạn có {notifications} thông báo mới</p>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            <DropdownMenuItem className="flex flex-col items-start p-4 gap-1 cursor-pointer hover:bg-slate-50 border-b">
                                <div className="flex items-center gap-2 w-full">
                                    <div className="font-medium text-slate-900">Đèn LED thông minh</div>
                                    <Badge className="ml-auto bg-green-100 text-green-700">Thấp</Badge>
                                </div>
                                <div className="text-sm text-gray-600">Đã được bật tự động theo lịch trình</div>
                                <div className="text-xs text-slate-500">Tự động • 498 ngày trước</div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex flex-col items-start p-4 gap-1 cursor-pointer hover:bg-slate-50 border-b">
                                <div className="flex items-center gap-2 w-full">
                                    <div className="font-medium text-slate-900">Cập nhật firmware</div>
                                    <Badge className="ml-auto bg-yellow-100 text-yellow-700">Trung bình</Badge>
                                </div>
                                <div className="text-sm text-gray-600">v2.1.4 có sẵn cho 3 thiết bị</div>
                                <div className="text-xs text-slate-500">Hệ thống • 499 ngày trước</div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex flex-col items-start p-4 gap-1 cursor-pointer hover:bg-slate-50">
                                <div className="flex items-center gap-2 w-full">
                                    <div className="font-medium text-slate-900">Cảnh báo nhiệt độ</div>
                                    <Badge className="ml-auto bg-orange-100 text-orange-700">Trung bình</Badge>
                                </div>
                                <div className="text-sm text-gray-600">Nhiệt độ phòng ngủ đã vượt quá ngưỡng an toàn (32°C)</div>
                                <div className="text-xs text-slate-500">Môi trường • 498 ngày trước</div>
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-center text-slate-600 cursor-pointer hover:bg-slate-50 font-medium">
                            Xem tất cả thông báo
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg transition-colors text-white hover:text-white h-auto"
                        >
                            <Avatar className="h-8 w-8 ring-2 ring-white/20">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                <AvatarFallback className="bg-slate-600 text-white">
                                    {username
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col items-start">
                                <span className="text-sm font-medium">{username}</span>
                                <span className="text-xs text-slate-300">{role}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 hidden md:block" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 bg-white shadow-xl border-0">
                        <div className="flex flex-col items-center p-4 gap-2 border-b bg-slate-50">
                            <Avatar className="h-16 w-16 ring-2 ring-slate-200">
                                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                                <AvatarFallback className="bg-slate-600 text-white text-lg">
                                    {username
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <div className="font-medium text-slate-900">{username}</div>
                                <div className="text-sm text-slate-600">{email}</div>
                                <Badge variant="secondary" className="mt-1">
                                    {role}
                                </Badge>
                            </div>
                        </div>

                        <DropdownMenuItem className="gap-3 cursor-pointer hover:bg-slate-50 p-3">
                            <User className="h-4 w-4 text-slate-600" />
                            <span className="text-slate-900">Hồ sơ của tôi</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 cursor-pointer hover:bg-slate-50 p-3">
                            <Calendar className="h-4 w-4 text-slate-600" />
                            <span className="text-slate-900">Lịch làm việc</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 cursor-pointer hover:bg-slate-50 p-3">
                            <Settings className="h-4 w-4 text-slate-600" />
                            <span className="text-slate-900">Cài đặt tài khoản</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-3 text-red-600 cursor-pointer hover:bg-red-50 p-3">
                            <LogOut className="h-4 w-4" />
                            <span>Đăng xuất</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
