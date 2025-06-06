// components/ui/OrderSummary.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OrderSummary({ 
    subtotal, 
    shippingFee, 
    discount, 
    vat, 
    discountAmount, 
    vatAmount, 
    total 
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Tổng kết đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                    <span>Phí giao hàng:</span>
                    <span>{shippingFee.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                    <span>Giảm giá ({discount}%):</span>
                    <span>-{discountAmount.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                    <span>VAT ({vat}%):</span>
                    <span>{vatAmount.toLocaleString()}đ</span>
                </div>
                <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Tổng cộng:</span>
                        <span>{total.toLocaleString()}đ</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}