import { Link } from "react-router-dom"
import { CheckCircle2, Home, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/utils/format"

export default function CheckoutSuccess({resultOrder, shipping, payment}) {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
                <p className="text-muted-foreground">Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.</p>
            </div>

            <Card className="max-w-2xl mx-auto mb-8">
                <CardHeader>
                    <CardTitle>Thông tin đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                            <p className="font-medium">{resultOrder.order_id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Ngày đặt hàng</p>
                            <p className="font-medium">{formatDate(resultOrder.created_at)}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                        <p className="font-medium">{shipping.fullName}</p>
                        <p className="text-sm">{shipping.address}, {shipping.ward}, {shipping.district}, {shipping.city}</p>
                        <p className="text-sm">{shipping.phone}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
                        <p className="font-medium">{payment.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán online'}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Phương thức vận chuyển</p>
                        <p className="font-medium">{shipping.shippingMethod === 'standard' ? 'Vận chuyển tiêu chuẩn' : 'Vận chuyển nhanh'}</p>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                        <p className="font-medium">Tổng thanh toán</p>
                        <p className="font-bold text-lg">{formatCurrency(resultOrder.total_money)}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild className="bg-blue-500 text-white border-gray-400">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Trang chủ
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/account/orders">
                            <Package className="mr-2 h-4 w-4" />
                            Theo dõi đơn hàng
                        </Link>
                    </Button>
                </CardFooter>
            </Card>

            <div className="max-w-2xl mx-auto text-center">
                <p className="text-sm text-muted-foreground">
                    Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi qua email{" "}
                    <a href="mailto:support@example.com" className="text-primary hover:underline">
                        support@example.com
                    </a>{" "}
                    hoặc gọi số{" "}
                    <a href="tel:1900123456" className="text-primary hover:underline">
                        1900 123 456
                    </a>
                    .
                </p>
            </div>
        </div>
    )
}