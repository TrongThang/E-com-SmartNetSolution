import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Heart, Key, MapPin, Package, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function MobileProfileNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [path, setPath] = React.useState(location.pathname)

  React.useEffect(() => {
    setPath(location.pathname)
  }, [location.pathname])

  return (
    <div className="mb-4 flex w-full flex-col gap-4">
      <Select
        value={path}
        onValueChange={(value) => {
          setPath(value)
          navigate(value)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Chọn mục" />
        </SelectTrigger>
        <SelectContent>
          {profileNavItems.map((item) => (
            <SelectItem key={item.href} value={item.href}>
              <div className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
