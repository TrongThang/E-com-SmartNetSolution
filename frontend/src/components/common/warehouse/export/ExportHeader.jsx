import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"

export function ExportHeader({ orders, totalProducts, isSubmitting, validateForm, onConfirm }) {
    const navigate = useNavigate()
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold">Tạo Phiếu Xuất Kho</h1>
                {orders.length > 0 && (
                    <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{orders.length} đơn hàng</Badge>
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/admin/warehouses/export")} className="border-red-500 text-red-500">
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