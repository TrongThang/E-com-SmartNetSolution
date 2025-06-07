"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { ArrowLeft, ChevronDown, ChevronUp, Package, Printer, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axiosPublic from "@/apis/clients/public.client"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/utils/format"
import QRCode from "react-qr-code"
import ProgressBar from "@/components/common/ProgressBar"

export default function ImportWarehouseDetailPage() {
    const { id } = useParams()
    const [warehouseData, setWarehouseData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [productTracking, setProductTracking] = useState([]);
    const [isProgressCollapsed, setIsProgressCollapsed] = useState(true);
    const [showToggleButton, setShowToggleButton] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        const fetchProductionTracking = async () => {
            const result = await axiosPublic.get(`import-warehouse/process/${id}`)

            if (result.status_code === 200) {
                console.log('result', result.data)
                setProductTracking(result.data)
            }
        }
        fetchProductionTracking()
        fetchWarehouseDetail()
    }, [id])

    useEffect(() => {
        const checkHeight = () => {
            if (contentRef.current) {
                const height = contentRef.current.scrollHeight;
                setShowToggleButton(height > 200);

                // Nếu nội dung nhỏ hơn 200px thì tự động mở rộng
                if (height <= 200 && isProgressCollapsed) {
                    setIsProgressCollapsed(false);
                }
            }
        };

        // Delay để đảm bảo DOM đã render xong
        const timer = setTimeout(checkHeight, 100);

        // Kiểm tra lại khi window resize
        const handleResize = () => {
            setTimeout(checkHeight, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, [productTracking, isProgressCollapsed]);


    const fetchWarehouseDetail = async () => {
        setLoading(true)
        try {
            const response = await axiosPublic.get(`/import-warehouse/detail/${id}`)
            console.log(response)
            if (response.status_code === 200) {
                setWarehouseData(response.data.data[0])
            }
        } catch (error) {
            toast.error("Không thể tải thông tin chi tiết kho")
            console.error(error)
        } finally {
            setLoading(false)
            console.log(warehouseData)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const toggleCollapse = () => {
        setIsProgressCollapsed(!isProgressCollapsed);
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-[200px]" />
                    <Skeleton className="h-[200px]" />
                </div>
                <Skeleton className="h-[400px]" />
            </div>
        )
    }

    if (!warehouseData) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Không tìm thấy thông tin kho</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Chi tiết nhập kho</h1>
                        <p className="text-muted-foreground">
                            Mã phiếu: {warehouseData.id}
                        </p>
                    </div>
                </div>
                <Button onClick={handlePrint} className="bg-blue-500 hover:bg-blue-600">
                    <Printer className="mr-2 h-4 w-4" />
                    In phiếu nhập kho
                </Button>
            </div>

            {/* Thông tin cơ bản */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Thông tin phiếu nhập</CardTitle>
                        <QRCode className="w-24 h-24" value={warehouseData.id} />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Ngày nhập</p>
                                <p>{formatDate(warehouseData.import_date || null)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nhân viên</p>
                                <p>{warehouseData.employee_name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kho nhập</p>
                                <p>{warehouseData.warehouse_name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Tổng tiền</p>
                                <p className="font-semibold text-green-600">{formatCurrency(warehouseData.total_money)}</p>
                            </div>
                        </div>
                        {warehouseData.note && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Ghi chú</p>
                                <p>{warehouseData.note}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin xác thực</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {warehouseData.file_authenticate ? (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">File xác thực</p>
                                <img
                                    src={warehouseData.file_authenticate}
                                    alt="File xác thực"
                                    className="text-blue-500 hover:underline"
                                />
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Không có file xác thực</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tiến trình nhập kho */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Tiến trình nhập kho</CardTitle>
                        {showToggleButton && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleCollapse}
                                className="flex items-center gap-2"
                            >
                                {isProgressCollapsed ? (
                                    <>
                                        <span>Mở rộng</span>
                                        <ChevronDown size={16} />
                                    </>
                                ) : (
                                    <>
                                        <span>Thu gọn</span>
                                        <ChevronUp size={16} />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div
                        ref={contentRef}
                        className={`overflow-y-auto transition-all duration-300 ease-in-out ${
                            isProgressCollapsed ? 'max-h-[200px]' : 'max-h-none'
                        }`}
                        style={{
                            maxHeight: isProgressCollapsed ? '200px' : 'none'
                        }}
                    >
                        {productTracking.map((item, index) => {
                            return (
                            <ProgressBar
                                key={index}
                                title={item.product_name}
                                target={Number(item.total_serial_need)}
                                current={Number(item.total_serial_imported)}
                                index={index}
                            />
                        )})}
                    </div>

                    {/* Gradient overlay khi thu gọn */}
                    {isProgressCollapsed && showToggleButton && (
                        <div className="relative -mt-8 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                </CardContent>
            </Card>

            {/* Chi tiết sản phẩm */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Package className="mr-2 h-5 w-5" />
                        Chi tiết sản phẩm
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead className="text-right">Số lượng</TableHead>
                                <TableHead className="text-right">Đơn giá</TableHead>
                                <TableHead className="text-right">Thành tiền</TableHead>
                                <TableHead>Ghi chú</TableHead>
                                <TableHead>Quà tặng</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {warehouseData.products?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <img src={item.product_image} alt={item.product_name} className="w-10 h-10 rounded-md" />
                                            <span>{item.product_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.import_price)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                    <TableCell>{item.detail_import_note || '-'}</TableCell>
                                    <TableCell>{item.is_gift ? 'Có' : 'Không'}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="icon" className="bg-red-500 hover:bg-red-600 text-white">
                                            <Undo2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}