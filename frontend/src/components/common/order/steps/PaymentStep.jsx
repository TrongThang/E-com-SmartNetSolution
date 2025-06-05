import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaymentStep({ orderData, setOrderData }) {
    const updatePayment = (field, value) => {
        setOrderData((prev) => ({
            ...prev,
            payment: { ...prev.payment, [field]: value },
        }))
    }

    const updateOrder = (field, value) => {
        setOrderData((prev) => ({
            ...prev,
            order: { ...prev.order, [field]: value },
        }))
    }

    // Calculate totals
    const subtotal = orderData.products.reduce(
        (sum, product) => sum + product.price * product.quantity * (1 - product.discount / 100),
        0,
    )
    const shippingFee = orderData.shipping.shippingMethod === "standard" ? 30000 : 50000
    const discountAmount = (subtotal * orderData.order.discount) / 100
    const vatAmount = ((subtotal - discountAmount) * orderData.order.vat) / 100
    const total = subtotal - discountAmount + vatAmount + shippingFee

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Thanh toán và tổng kết</h3>

            {/* Order Summary */}
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
                        <span>Giảm giá ({orderData.order.discount}%):</span>
                        <span>-{discountAmount.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between">
                        <span>VAT ({orderData.order.vat}%):</span>
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

            {/* Payment and Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Thông tin thanh toán</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Phương thức thanh toán</Label>
                            <Select
                                value={orderData.payment.payment_method}
                                onValueChange={(value) => updatePayment("payment_method", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CASH">Tiền mặt</SelectItem>
                                    <SelectItem value="BANK_TRANSFER">Chuyển khoản</SelectItem>
                                    <SelectItem value="CREDIT_CARD">Thẻ tín dụng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Số tiền trả trước</Label>
                            <Input
                                type="number"
                                value={orderData.payment.prepaid}
                                onChange={(e) => updatePayment("prepaid", Number(e.target.value))}
                                placeholder="Số tiền trả trước"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Số tiền còn lại</Label>
                            <Input type="number" value={total - orderData.payment.prepaid} readOnly className="bg-muted" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Thông tin đơn hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Giảm giá (%)</Label>
                            <Input
                                type="number"
                                value={orderData.order.discount}
                                onChange={(e) => updateOrder("discount", Number(e.target.value))}
                                placeholder="Giảm giá"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>VAT (%)</Label>
                            <Input
                                type="number"
                                value={orderData.order.vat}
                                onChange={(e) => updateOrder("vat", Number(e.target.value))}
                                placeholder="VAT"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Ghi chú</Label>
                            <Input
                                value={orderData.order.note}
                                onChange={(e) => updateOrder("note", e.target.value)}
                                placeholder="Ghi chú đơn hàng"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Nền tảng</Label>
                            <Select
                                value={orderData.order.platform_order}
                                onValueChange={(value) => updateOrder("platform_order", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="WEB">Website</SelectItem>
                                    <SelectItem value="MOBILE">Mobile App</SelectItem>
                                    <SelectItem value="FACEBOOK">Facebook</SelectItem>
                                    <SelectItem value="SHOPEE">Shopee</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}