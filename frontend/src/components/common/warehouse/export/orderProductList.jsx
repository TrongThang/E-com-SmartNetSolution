"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function OrderProductList({ order }) {

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="w-[80px] text-right">Số lượng</TableHead>
                        <TableHead className="w-[120px] text-right">Đơn giá</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {order.products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-right">{product.quantity}</TableCell>
                            <TableCell className="text-right">{product.sale_price.toLocaleString()} VNĐ</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}