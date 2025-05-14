import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { OrderProductList } from "@/components/common/warehouse/export/orderProductList"

export function OrderList({ orders, onRemoveOrder, onBatchDetailUpdate }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Danh sách đơn hàng xuất kho</CardTitle>
                <CardDescription>
                    {orders.length > 0
                        ? `${orders.length} đơn hàng được chọn`
                        : "Chưa có đơn hàng nào được chọn"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Vui lòng chọn đơn hàng từ danh sách bên trái
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium">Đơn hàng #{order.id}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Khách hàng: {order.customer_name} | Ngày đặt: {order.order_date}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => onRemoveOrder(order.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <OrderProductList
                                    order={order}
                                    onBatchDetailUpdate={(productId, batchDetails) =>
                                        onBatchDetailUpdate(order.id, productId, batchDetails)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}