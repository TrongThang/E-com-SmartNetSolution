import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/utils/format"
import { useCart } from "@/contexts/CartContext"

export function CheckoutSummary({ shippingFee }) {
    const { getItemSelected } = useCart()
    const cartItems = getItemSelected()

    // Sample cart calculation
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const discount = 0
    const total = subtotal + shippingFee - discount

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Tổng Thanh Toán</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Tạm tính</span>
                            <span className="text-sm font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Phí vận chuyển</span>
                            <span className="text-sm font-medium">{formatCurrency(shippingFee)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Giảm giá</span>
                                <span className="text-sm font-medium text-red-500">-{discount.toLocaleString()} VNĐ</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex items-center justify-between pt-6">
                <span className="text-base font-semibold">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">{total.toLocaleString()} VNĐ</span>
            </CardFooter>
        </Card>
    )
}
