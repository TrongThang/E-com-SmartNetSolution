"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Eye, Truck, CheckCircle, AlertCircle, Clock, ChevronUp } from "lucide-react"
import orderApi from "@/apis/modules/order.api.ts"
import { toast } from "sonner"


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

  const getStatusInfo = (status) => {
    switch (status) {
      case 0:
        return { statusIcon: Clock, statusColor: "text-yellow-500", status: "Chờ xác nhận" }
      case 1:
        return { statusIcon: Package, statusColor: "text-muted-foreground", status: "Chuẩn bị hàng" }
      case 2:
        return { statusIcon: Truck, statusColor: "text-blue-500", status: "Đang giao hàng" }
      case 3:
        return { statusIcon: Truck, statusColor: "text-blue-500", status: "Đang giao hàng" }
      case 4:
        return { statusIcon: CheckCircle, statusColor: "text-green-500", status: "Hoàn thành" }
      case -1:
        return { statusIcon: AlertCircle, statusColor: "text-red-500", status: "Đã hủy" }
      default:
        return { statusIcon: AlertCircle, statusColor: "text-red-500", status: "Không xác định" }
    }
  }

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderApi.getById("CUST0001");
      if (res.status_code === 200) {
        const dataWithStatus = res.data.data.map(order => ({
          ...order,
          ...getStatusInfo(order.status)
        }));
        setOrders(dataWithStatus);
      }
      else {
        setError("Không thể tải đơn hàng");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải đơn hàng");
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmCancel = async (id, order_id) => {
    toast(() => (
      <div className="flex flex-col gap-2">
        <p>Bạn có chắc chắn muốn hủy đơn hàng có mã <strong>{order_id}</strong> không?</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.dismiss()}
          >
            Không
          </Button>
          <Button
            size="sm"
            onClick={async () => {
              toast.dismiss()
              try {
                const res = await orderApi.canceled({ order_id: id });
                if (res.status_code === 200) {
                  toast.success("Hủy đơn hàng thành công");
                  await fetchData();
                } else {
                  toast.error("Không thể hủy đơn hàng");
                }
              } catch (err) {
                toast.error("Đã xảy ra lỗi khi hủy đơn hàng");
                console.error("Failed to cancel order", err);
              }
            }}
          >
            Có, hủy ngay
          </Button>
        </div>
      </div>
    ));
  };
  

  // Component để hiển thị một đơn hàng
  const OrderItem = ({ order }) => {
    const StatusIcon = order.statusIcon
    return (
      <div key={order.id} className="rounded-lg border p-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="font-medium">{order.order_id}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })} | {order.count_product} sản phẩm
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="text-lg font-bold">
              {Number(order.total_money).toLocaleString('vi-VN')}đ
            </div>

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
          {(order.status === "Chờ xác nhận" || order.status === "Chuẩn bị hàng") && (
            <Button className="ml-3" size="sm" onClick={() => confirmCancel(order.id, order.order_id)}>Hủy đơn</Button>
          )}
        </div>

        {/* Chi tiết đơn hàng - hiển thị khi được mở rộng */}
        {expandedOrders[order.id] && (
          <div className="mt-4 rounded-md border bg-muted/20 p-4">
            <h3 className="mb-3 font-medium">Chi tiết đơn hàng</h3>
            <div className="space-y-3">
              {order.details.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col rounded-md border bg-background p-3 sm:flex-row sm:items-center"
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <img
                        src={product.image.startsWith("data:") ? product.image : `data:image/jpeg;base64,${product.image}`}
                        alt={product.product_name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{product.product_name}</h4>
                      <p className="text-sm text-muted-foreground">Đơn giá: {Number(product.price).toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-4 sm:mt-0 sm:justify-end">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Số lượng</p>
                      <p className="font-medium">{product.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Thành tiền</p>
                      <p className="font-medium">{Number(product.price * product.quantity).toLocaleString('vi-VN')}đ</p>
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
    <>
    {(loading && !error) && (
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng của tôi</CardTitle>
          <CardDescription>Quản lý và theo dõi tất cả đơn hàng của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-7">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-gray-200">
              <TabsTrigger value="all" className="bg-gray-200 hover:bg-gray-300 data-[state=active]:text-white transition-colors">Tất cả</TabsTrigger>
              <TabsTrigger value="pending" className="bg-gray-200 hover:bg-gray-300 data-[state=active]:text-white transition-colors">Chờ xác nhận</TabsTrigger>
              <TabsTrigger value="preparing" className="bg-gray-200 hover:bg-gray-300 data-[state=active]:text-white transition-colors">Chuẩn bị hàng</TabsTrigger>
              <TabsTrigger value="shipping" className="bg-gray-200 hover:bg-gray-300 data-[state=active]:text-white transition-colors">Đang giao hàng</TabsTrigger>
              <TabsTrigger value="delivered" className="bg-gray-200 hover:bg-gray-300 data-[state=active]:text-white transition-colors">Đã giao</TabsTrigger>
              <TabsTrigger value="completed" className="bg-gray-200 hover:bg-gray-300 data-[state=active]:text-white transition-colors">Hoàn thành</TabsTrigger>
              <TabsTrigger value="canceled" className="bg-gray-200 hover:bg-gray-300 data-[state=active]:text-white transition-colors">Đã hủy</TabsTrigger>
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
    )}
    </>
  )
}
