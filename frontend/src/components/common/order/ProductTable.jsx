// components/ui/ProductTable.jsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X } from "lucide-react"

export function ProductTable({ products, onRemoveProduct }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Danh sách sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã SP</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead>Giảm giá</TableHead>
                            <TableHead>Thành tiền</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow key={index}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price.toLocaleString()}đ</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>{product.discount}%</TableCell>
                                <TableCell>
                                    {(product.price * product.quantity * (1 - product.discount / 100)).toLocaleString()}đ
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        onClick={() => onRemoveProduct(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}