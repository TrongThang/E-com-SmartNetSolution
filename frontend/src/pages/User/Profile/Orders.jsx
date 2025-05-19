"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Eye, Truck, CheckCircle, AlertCircle, Clock, ChevronUp } from "lucide-react"

// Dữ liệu mẫu cho đơn hàng
const orders = [
  {
    id: "ORD-123456",
    date: "15/07/2023",
    total: "1.250.000 đ",
    status: "Đã hoàn thành",
    items: 3,
    statusIcon: CheckCircle,
    statusColor: "text-green-500",
    products: [
      {
        id: 1,
        name: "iPhone 14 Pro",
        image: "/placeholder.svg?height=80&width=80",
        price: "28.990.000 đ",
        quantity: 1,
        total: "28.990.000 đ",
      },
      {
        id: 2,
        name: "Ốp lưng iPhone 14 Pro",
        image: "/placeholder.svg?height=80&width=80",
        price: "500.000 đ",
        quantity: 2,
        total: "1.000.000 đ",
      },
      {
        id: 3,
        name: "Cáp sạc Lightning",
        image: "/placeholder.svg?height=80&width=80",
        price: "250.000 đ",
        quantity: 1,
        total: "250.000 đ",
      },
    ],
  },
  {
    id: "ORD-123457",
    date: "10/07/2023",
    total: "850.000 đ",
    status: "Đang giao hàng",
    items: 2,
    statusIcon: Truck,
    statusColor: "text-blue-500",
    products: [
      {
        id: 4,
        name: "Tai nghe Bluetooth",
        image: "/placeholder.svg?height=80&width=80",
        price: "550.000 đ",
        quantity: 1,
        total: "550.000 đ",
      },
      {
        id: 5,
        name: "Sạc dự phòng 10000mAh",
        image: "/placeholder.svg?height=80&width=80",
        price: "300.000 đ",
        quantity: 1,
        total: "300.000 đ",
      },
    ],
  },
  {
    id: "ORD-123458",
    date: "05/07/2023",
    total: "2.150.000 đ",
    status: "Chờ xác nhận",
    items: 4,
    statusIcon: Clock,
    statusColor: "text-yellow-500",
    products: [
      {
        id: 6,
        name: "Laptop Sleeve 13 inch",
        image: "/placeholder.svg?height=80&width=80",
        price: "450.000 đ",
        quantity: 1,
        total: "450.000 đ",
      },
      {
        id: 7,
        name: "Bàn phím không dây",
        image: "/placeholder.svg?height=80&width=80",
        price: "750.000 đ",
        quantity: 1,
        total: "750.000 đ",
      },
      {
        id: 8,
        name: "Chuột không dây",
        image: "/placeholder.svg?height=80&width=80",
        price: "350.000 đ",
        quantity: 1,
        total: "350.000 đ",
      },
      {
        id: 9,
        name: "Đế tản nhiệt laptop",
        image: "/placeholder.svg?height=80&width=80",
        price: "600.000 đ",
        quantity: 1,
        total: "600.000 đ",
      },
    ],
  },
  {
    id: "ORD-123459",
    date: "01/07/2023",
    total: "750.000 đ",
    status: "Đã hủy",
    items: 1,
    statusIcon: AlertCircle,
    statusColor: "text-red-500",
    products: [
      {
        id: 10,
        name: "Tai nghe chụp tai",
        image: "/placeholder.svg?height=80&width=80",
        price: "750.000 đ",
        quantity: 1,
        total: "750.000 đ",
      },
    ],
  },
]

export default function OrdersPage() {
  // State để theo dõi đơn hàng nào đang được mở rộng
  const [expandedOrders, setExpandedOrders] = useState({})

  // Hàm để toggle trạng thái mở rộng của đơn hàng
  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  // Component để hiển thị một đơn hàng
  const OrderItem = ({ order }) => {
    const StatusIcon = order.statusIcon
    return (
      <div key={order.id} className="rounded-lg border p-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Ngày đặt: {order.date} | {order.items} sản phẩm
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="text-lg font-bold">{order.total}</div>
            <div className={`flex items-center gap-1 ${order.statusColor}`}>
              <StatusIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{order.status}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => toggleOrderDetails(order.id)}>
            {expandedOrders[order.id] ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Ẩn chi tiết
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </>
            )}
          </Button>
          <Button className="ml-3" size="sm" >Hủy đơn</Button>
        </div>

        {/* Chi tiết đơn hàng - hiển thị khi được mở rộng */}
        {expandedOrders[order.id] && (
          <div className="mt-4 rounded-md border bg-muted/20 p-4">
            <h3 className="mb-3 font-medium">Chi tiết đơn hàng</h3>
            <div className="space-y-3">
              {order.products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col rounded-md border bg-background p-3 sm:flex-row sm:items-center"
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">Đơn giá: {product.price}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-4 sm:mt-0 sm:justify-end">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Số lượng</p>
                      <p className="font-medium">{product.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Thành tiền</p>
                      <p className="font-medium">{product.total}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng của tôi</CardTitle>
        <CardDescription>Quản lý và theo dõi tất cả đơn hàng của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-7">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
            <TabsTrigger value="preparing">Chuẩn bị hàng</TabsTrigger>
            <TabsTrigger value="shipping">Đang giao hàng</TabsTrigger>
            <TabsTrigger value="delivered">Đã giao</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
            <TabsTrigger value="canceled">Đã hủy</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="pt-4">
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="pt-4">
            <div className="space-y-4">
              {orders
                .filter((order) => order.status === "Chờ xác nhận")
                .map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="pt-4">
            <div className="space-y-4">
              {orders
                .filter((order) => order.status === "Đang giao hàng")
                .map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>

            <TabsContent value="completed" className="pt-4">
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "Đã giao hàng")
                  .map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="canceled" className="pt-4">
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "Đã hủy")
                  .map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
              </div>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
