import { Link } from "react-router-dom"
import { CheckCircle2, Home, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function CheckoutSuccessPage() {
    // Sample order details
    const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000)
    const orderDate = new Date().toLocaleDateString("vi-VN")
    const orderTotal = "9,930,000 VNĐ"

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
                            <p className="font-medium">{orderNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Ngày đặt hàng</p>
                            <p className="font-medium">{orderDate}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                        <p className="font-medium">Nguyễn Văn A</p>
                        <p className="text-sm">123 Đường Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh</p>
                        <p className="text-sm">0987654321</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
                        <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Phương thức vận chuyển</p>
                        <p className="font-medium">Giao hàng tiêu chuẩn (2-3 ngày)</p>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                        <p className="font-medium">Tổng thanh toán</p>
                        <p className="font-bold text-lg">{orderTotal}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
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