"use client"

import { useState, useEffect } from "react"
import { Check, Search, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import axiosPublic from "@/apis/clients/public.client"
import { ORDER_STATUS } from "@/constants/status.constants"

export function OrderSelection({ onOrderSelect, selectedOrders }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchOrders = async () => {
            const filter = [
                {
                    logic: "AND",
                    conditions: [
                        { field: "order.status", condition: ">=", value: ORDER_STATUS.PENDING },
                        { field: "order.status", condition: "<=", value: ORDER_STATUS.PREPARING }
                    ]
                }
            ]
            const response = await axiosPublic.get(`/order/admin/warehouse`, {    
                params: {
                    filter: JSON.stringify(filter),
                }
            })

            console.log('response', response)
            
            if (response.status_code === 200) {
                setOrders(response.data.data)
            }
            setLoading(false)
        }
        fetchOrders()
    }, [])

    // Filter orders based on search term
    const filteredOrders = orders.filter(
        (order) =>
            order.id.toString().includes(searchTerm) ||
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Check if an order is already selected
    const isOrderSelected = (orderId) => {
        return selectedOrders.some((order) => order.id === orderId)
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Tìm theo mã đơn hoặc tên khách hàng"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <ScrollArea className="h-[400px]">
                {loading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex flex-col space-y-2 p-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ))}
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                        {filteredOrders.map((order) => {
                            const isSelected = isOrderSelected(order.id)
                            return (
                                <Card
                                    key={order.id}
                                    className={`hover:bg-muted transition-colors cursor-pointer ${isSelected ? "border-primary" : ""}`}
                                    onClick={() => !isSelected && onOrderSelect(order)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium">Đơn hàng #{order.id}</h4>
                                                    {isSelected && (
                                                        <Badge variant="success" className="text-xs text-green-500">
                                                            <Check className="h-3 w-3 mr-1" />
                                                            Đã chọn
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.customer_name} - {order.order_date}
                                                </p>
                                                <p className="text-sm font-medium mt-1">{order.total_amount?.toLocaleString()} VNĐ</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <Badge variant="outline" className="mb-2">
                                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                                    {order.products.length} sản phẩm
                                                </Badge>
                                                <Button size="sm" variant={isSelected ? "outline" : "default"} disabled={isSelected}>
                                                    {isSelected ? "Đã chọn" : "Chọn"}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            {order.products.map((product) => (
                                                <div key={product.id} className="flex justify-between">
                                                    <span>{product.name}</span>
                                                    <span>x{product.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-4 text-muted-foreground">Không tìm thấy đơn hàng nào</div>
                )}
            </ScrollArea>
        </div>
    )
}