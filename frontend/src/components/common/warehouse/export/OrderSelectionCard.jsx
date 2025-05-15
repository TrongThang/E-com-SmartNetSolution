import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderSelection } from "@/components/common/warehouse/export/orderSelection"

export function OrderSelectionCard({ onOrderSelect, selectedOrders }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Chọn đơn hàng</CardTitle>
                <CardDescription>Chọn đơn hàng cần xuất kho</CardDescription>
            </CardHeader>
            <CardContent>
                <OrderSelection onOrderSelect={onOrderSelect} selectedOrders={selectedOrders} />
            </CardContent>
        </Card>
    )
}