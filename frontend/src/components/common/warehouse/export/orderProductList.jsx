"use client"

import { useState, useEffect } from "react"
import { Scan, QrCode, X, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import QRCode from "react-qr-code";

export function OrderProductList({ order, onBatchDetailUpdate }) {
    const [isShowQR, setIsShowQR] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [manualInputs, setManualInputs] = useState([])
    const [isManualInputOpen, setIsManualInputOpen] = useState(false)

    // Tổng số lượng và đã quét
    const totalProductsQuantity = order.products.reduce((total, product) => total + product.quantity, 0)
    const totalScannedItems = order.products.reduce(
        (total, product) => total + product.batch_product_details.length,
        0,
    )

    // Xử lý khi chọn sản phẩm để nhập thủ công
    const handleManualInput = (product) => {
        setSelectedProduct(product)
        // Tạo mảng input trống dựa trên số lượng còn thiếu
        const remainingQuantity = product.quantity - product.batch_product_details.length
        setManualInputs(Array(remainingQuantity).fill(""))
        setIsManualInputOpen(true)
    }

    // Xử lý khi thay đổi giá trị input
    const handleInputChange = (index, value) => {
        const newInputs = [...manualInputs]
        newInputs[index] = value
        setManualInputs(newInputs)
    }

    // Xử lý khi submit form nhập thủ công
    const handleManualSubmit = () => {
        if (!selectedProduct) return

        // Kiểm tra xem có input nào trống không
        // if (manualInputs.some(input => !input.trim())) {
        //     alert("Vui lòng nhập đầy đủ các mã barcode!")
        //     return
        // }

        // Kiểm tra trùng lặp
        const hasDuplicates = manualInputs.some((input, index) => 
            manualInputs.indexOf(input) !== index
        )
        if (hasDuplicates) {
            alert("Có mã barcode bị trùng lặp!")
            return
        }

        // Kiểm tra trùng với các mã đã quét trước đó
        const existingBarcodes = selectedProduct.batch_product_details.map(detail => detail.serial_number)
        const hasExistingDuplicates = manualInputs.some(input => 
            existingBarcodes.includes(input)
        )
        if (hasExistingDuplicates) {
            alert("Có mã barcode đã tồn tại trong danh sách!")
            return
        }

        // Lấy đúng số lượng cần thiết
        const needed = selectedProduct.quantity - selectedProduct.batch_product_details.length
        const validInputs = manualInputs.slice(0, needed)

        // Thêm các mã mới vào danh sách
        const newBatchDetails = validInputs.map(serial_number => ({
            serial_number,
            import_price: 20000000, // Giá nhập mặc định
            sale_price: selectedProduct.sale_price,
        }))

        const updatedBatchDetails = [
            ...selectedProduct.batch_product_details,
            ...newBatchDetails
        ]

        onBatchDetailUpdate(selectedProduct.id, updatedBatchDetails)
        setIsManualInputOpen(false)
        setSelectedProduct(null)
        setManualInputs([])
    }

    // Xoá barcode khỏi sản phẩm
    const handleRemoveBarcode = (product, serial_number) => {
        const newBatch = product.batch_product_details.filter(detail => detail.serial_number !== serial_number)
        onBatchDetailUpdate(product.id, newBatch)
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex justify-between items-center">
                        <span>Tiến độ quét mã</span>
                        <span className="text-sm font-normal">
                            {totalScannedItems}/{totalProductsQuantity} sản phẩm
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Progress value={(totalScannedItems / totalProductsQuantity) * 100} className="h-2" />
                        <div className="flex justify-end">
                            <Button
                                onClick={() => setIsShowQR(true)}
                                disabled={totalScannedItems >= totalProductsQuantity}
                                className="w-full sm:w-auto"
                            >
                                <Scan className="h-4 w-4 mr-2" />
                                Quét bằng điện thoại
                            </Button>
                        </div>
                        {isShowQR && (
                            <div className="flex flex-col items-center mt-4">
                                <div className="text-xs text-muted-foreground mt-2 flex flex-col items-center">
                                    Quét mã này bằng ứng dụng điện thoại để kết nối và quét barcode
                                    <QRCode value="https://example.com" className="mt-2"/>
                                </div>
                                <Button size="sm" className="mt-2" onClick={() => setIsShowQR(false)}>
                                    Đóng
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="w-[80px] text-right">Số lượng</TableHead>
                        <TableHead className="w-[120px] text-right">Đơn giá</TableHead>
                        <TableHead className="w-[100px] text-right">Đã quét</TableHead>
                        <TableHead>Barcode đã quét</TableHead>
                        <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {order.products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-right">{product.quantity}</TableCell>
                            <TableCell className="text-right">{product.sale_price.toLocaleString()} VNĐ</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={product.batch_product_details.length === product.quantity ? "success" : "outline"}>
                                    {product.batch_product_details.length}/{product.quantity}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-2">
                                    {product.batch_product_details.map((detail, idx) => (
                                        <Badge key={idx} variant="outline" className="flex items-center gap-1">
                                            <QrCode className="h-3 w-3" />
                                            {detail.serial_number}
                                            <button
                                                className="ml-1 text-muted-foreground hover:text-destructive"
                                                onClick={() => handleRemoveBarcode(product, detail.serial_number)}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                {product.batch_product_details.length < product.quantity && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleManualInput(product)}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Nhập thủ công
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Modal nhập thủ công */}
            <Dialog open={isManualInputOpen} onOpenChange={setIsManualInputOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Nhập thủ công mã barcode</DialogTitle>
                        <DialogDescription>
                            Nhập mã barcode cho {selectedProduct?.name}. Còn thiếu {manualInputs.length} mã.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {manualInputs.map((input, index) => (
                            <div key={index} className="space-y-2">
                                <Label htmlFor={`barcode-${index}`}>Mã barcode {index + 1}</Label>
                                <Input
                                    id={`barcode-${index}`}
                                    value={input}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    placeholder="Nhập mã barcode"
                                />
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsManualInputOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleManualSubmit}>
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}