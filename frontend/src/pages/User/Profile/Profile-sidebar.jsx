import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Heart, Key, MapPin, Package, User } from "lucide-react"

const profileNavItems = [
  {
    title: "Thông tin cá nhân",
    href: "/profile/info",
    icon: User,
  },
  {
    title: "Đơn hàng của tôi",
    href: "/profile/orders",
    icon: Package,
  },
  {
    title: "Địa chỉ",
    href: "/profile/addresses",
    icon: MapPin,
  },
  {
    title: "Sản phẩm yêu thích",
    href: "/profile/liked",
    icon: Heart,
  },
  {
    title: "Đổi mật khẩu",
    href: "/profile/change-password",
    icon: Key,
  },
]

export default function ProfileSidebar() {
  const location = useLocation()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {profileNavItems.map((item, index) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href

          return (
            <Button
              key={index}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive 
                  ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8]" 
                  : "text-gray-500 hover:bg-gray-100",
              )}
              asChild
            >
              <Link to={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
