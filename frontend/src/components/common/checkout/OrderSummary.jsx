import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/utils/format"
import { useCart } from "@/contexts/CartContext"

export function OrderSummary() {
    const { getItemSelected } = useCart()
    const cartItems = getItemSelected()

    return (
        <Card className="mb-6">
            <CardHeader className="pb-3">
                <CardTitle>Đơn Hàng Của Bạn</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-start space-x-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                                <img src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className="text-sm font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-bold text-blue-600">x{item.quantity}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-blue-600">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Tạm tính</span>
                        <span className="text-sm text-red-500 font-bold">
                            {formatCurrency(cartItems.reduce((total, item) => total + item.price * item.quantity, 0))}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
