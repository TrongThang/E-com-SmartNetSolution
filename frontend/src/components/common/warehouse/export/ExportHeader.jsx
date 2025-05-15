import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ExportHeader({ orders, totalProducts, totalScanned, isSubmitting, validateForm, onCancel, onConfirm }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold">Tạo Phiếu Xuất Kho</h1>
                {orders.length > 0 && (
                    <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{orders.length} đơn hàng</Badge>
                        <Badge variant="outline">
                            {totalScanned}/{totalProducts} sản phẩm đã quét
                        </Badge>
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel} className="border-red-500 text-red-500">
                    Hủy
                </Button>
                <Button onClick={onConfirm} disabled={!validateForm() || isSubmitting} className="bg-blue-500 text-white">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Lưu phiếu xuất
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}