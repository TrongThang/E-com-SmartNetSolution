"use client"

import { useState, useEffect, useRef } from "react"
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
import QRCode from "react-qr-code"
import { generateConnectionCode, verifyConnection, connectSocket } from "@/utils/socketQR"
import { toast } from "sonner"

export function OrderProductList({ order, onBatchDetailUpdate }) {
    const [isShowQR, setIsShowQR] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [manualInputs, setManualInputs] = useState([])
    const [isManualInputOpen, setIsManualInputOpen] = useState(false)
    const [connectionData, setConnectionData] = useState(null)
    const [isConnecting, setIsConnecting] = useState(false)
    const socketRef = useRef(null)

    // Tổng số lượng và đã quét
    const totalProductsQuantity = order.products.reduce((total, product) => total + product.quantity, 0)
    const totalScannedItems = order.products.reduce(
        (total, product) => total + product.batch_product_details.length,
        0,
    )

    useEffect(() => {
        let isMounted = true;

        const setup = async () => {
            setIsConnecting(true);
            try {
                // 1. Tạo room và render QR code
                const result = await generateConnectionCode(order.customer_id);
                if (result && isMounted) {
                    setConnectionData(result);

                    // 2. FE cũng xác thực để lấy token
                    const token = await verifyConnection(order.customer_id, result.roomCode, result.password);
                    if (token) {
                        // 3. FE kết nối socket với token
                        const socket = connectSocket(token, result.roomCode);
                        socketRef.current = socket;

                        socket.on('connect', () => {
                            toast.success('FE đã kết nối socket');
                        });

                        socket.on('server_message', (data) => {
                            // Xử lý dữ liệu từ mobile gửi lên
                            console.log('Dữ liệu từ mobile:', data);
                            toast.success('Nhận dữ liệu từ mobile!');
                            // Ví dụ: cập nhật sản phẩm
                            onBatchDetailUpdate(data.product_id, data.batch_product_details);
                        });

                        socket.on('disconnect', () => {
                            toast.info('Socket đã ngắt kết nối');
                        });
                    } else {
                        toast.error('Không xác thực được để kết nối socket');
                    }
                } else {
                    setConnectionData(null);
                }
            } catch (error) {
                toast.error('Không thể tạo kết nối');
                setIsShowQR(false);
            } finally {
                setIsConnecting(false);
            }
        };

        if (isShowQR) {
            setup();
        }

        return () => {
            if (socketRef.current && typeof socketRef.current.disconnect === 'function') {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setConnectionData(null);
        };
    }, [isShowQR, order.customer_id]);

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

        // Kiểm tra trùng lặp
        const hasDuplicates = manualInputs.some((input, index) => 
            manualInputs.indexOf(input) !== index
        )
        if (hasDuplicates) {
            toast.error("Có mã barcode bị trùng lặp!");
            return
        }

        // Kiểm tra trùng với các mã đã quét trước đó
        const existingBarcodes = selectedProduct.batch_product_details.map(detail => detail.serial_number)
        const hasExistingDuplicates = manualInputs.some(input => 
            existingBarcodes.includes(input)
        )
        if (hasExistingDuplicates) {
            toast.error("Có mã barcode đã tồn tại trong danh sách!");
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
        toast.success('Đã thêm mã barcode mới');
    }

    // Xoá barcode khỏi sản phẩm
    const handleRemoveBarcode = (product, serial_number) => {
        const newBatch = product.batch_product_details.filter(detail => detail.serial_number !== serial_number)
        onBatchDetailUpdate(product.id, newBatch)
        toast.success('Đã xóa mã barcode');
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
                                disabled={totalScannedItems >= totalProductsQuantity || isConnecting}
                                className="w-full sm:w-auto"
                            >
                                <Scan className="h-4 w-4 mr-2" />
                                {isConnecting ? 'Đang kết nối...' : 'Quét bằng điện thoại'}
                            </Button>
                        </div>
                        {isShowQR && connectionData && (
                            <div className="flex flex-col items-center mt-4">
                                <div className="text-xs text-muted-foreground mt-2 flex flex-col items-center">
                                    Quét mã này bằng ứng dụng điện thoại để kết nối và quét barcode
                                    <QRCode 
                                        value={JSON.stringify(connectionData)} 
                                        className="mt-2"
                                    />
                                </div>
                                <Button 
                                    size="sm" 
                                    className="mt-2" 
                                    onClick={() => {
                                        setIsShowQR(false);
                                    }}
                                >
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