import { useState } from "react";
import { Badge, Bell, Calendar, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import avatar from "@/assets/img/avatar.jpg";
function Topbar() {
    const [notifications] = useState(2);

    // Dữ liệu mẫu cho notifications
    const notificationItems = [
        {
            id: 1,
            title: "Đơn hàng mới",
            message: "Bạn có đơn hàng mới #12345",
            time: "5 phút trước"
        },
        {
            id: 2,
            title: "Cập nhật đơn hàng",
            message: "Đơn hàng #12344 đã được cập nhật",
            time: "10 phút trước"
        }
    ];
    // Dữ liệu mẫu
    const username = "Nguyễn Văn A";
    const email = "nguyenvana@smartnet.com";

    const now = new Date();
    const time = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <div className="h-20 w-full bg-[#232B36]  flex items-center justify-end px-8 gap-6">
            <div className="text-right">
                <div className="font-semibold text-lg text-white">{time}</div>
                <div className="text-xs text-gray-300">{date}</div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative p-1.5 hover:bg-gray-700 rounded-md transition-colors">
                        <Bell className="size-6 text-white" />
                        {notifications > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                                {notifications}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white">
                    <div className="p-2 border-b">
                        <h3 className="font-semibold">Thông báo</h3>
                    </div>
                    {notificationItems.map((item) => (
                        <DropdownMenuItem key={item.id} className="flex flex-col items-start p-3 gap-1 cursor-pointer hover:bg-gray-100">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-600">{item.message}</div>
                            <div className="text-xs text-gray-400">{item.time}</div>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center text-blue-600 cursor-pointer">
                        Xem tất cả thông báo
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative flex items-center gap-2 hover:bg-gray-700 p-1.5 rounded-md transition-colors h-auto"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={avatar} />
                        </Avatar>
                        <div className="flex flex-col items-start hidden md:block">
                            <span className="text-sm font-medium text-white">{username}</span>
                        </div>
                        <ChevronDown className="size-4 ml-1 hidden md:block text-white" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white">
                    <div className="flex flex-col items-center p-4 gap-2 border-b">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={avatar} />
                        </Avatar>
                        <div className="text-center">
                            <div className="font-medium">{username}</div>
                            <div className="text-sm text-gray-500">{email}</div>
                        </div>
                    </div>

                    <DropdownMenuItem className="gap-2 cursor-pointer">
                        <User className="size-4" />
                        <span>
                            <a href="/admin/profile">Hồ sơ của tôi
                            </a>
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Calendar className="size-4" />
                        <span>Lịch làm việc</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Settings className="size-4" />
                        <span>Cài đặt tài khoản</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-red-500 cursor-pointer">
                        <LogOut className="size-4" />
                        <span>Đăng xuất</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default Topbar;