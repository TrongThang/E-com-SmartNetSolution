"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Package, Printer, ExternalLink, ChevronDown, ChevronRight, ChevronUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axiosPublic from "@/apis/clients/public.client"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/utils/format"
import { Link } from "react-router-dom"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import ProgressBar from "@/components/common/ProgressBar"
import { useManufacturing } from "@/hooks/useManufacturing"
import QRCode from "react-qr-code"

export default function ExportWarehouseDetailPage() {
    const { id } = useParams()
    const [warehouseData, setWarehouseData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [expandedOrders, setExpandedOrders] = useState(new Set())
    const [expandedProducts, setExpandedProducts] = useState(new Set())
    const [isProgressCollapsed, setIsProgressCollapsed] = useState(true);
    const [showToggleButton, setShowToggleButton] = useState(false);
    const { exportProductTracking, setExportProductTracking } = useManufacturing()
    const contentRef = useRef(null);
    const navigate = useNavigate()

    useEffect(() => {
        fetchWarehouseDetail()
        fetchProductionTracking()
    }, [id])

    const fetchWarehouseDetail = async () => {
        setLoading(true)
        try {
            const response = await axiosPublic.get(`/export-warehouse/detail/${id}`)
            if (response.status_code === 200) {
                setWarehouseData(response.data.data[0])
                // Mở rộng tất cả các orders mặc định
                const orderIds = new Set(response.data.data[0].orders.map(order => order.order_id))
                setExpandedOrders(orderIds)

                const productIds = new Set(response.data.data[0].orders.flatMap(order => order.products.map(product => product.product_id)))
                setExpandedProducts(productIds)
            }
        } catch (error) {
            toast.error("Không thể tải thông tin chi tiết xuất kho")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchProductionTracking = async () => {
        const result = await axiosPublic.get(`export-warehouse/process/${id}`)

        if (result.status_code === 200) {
            console.log('result', result.data)
            setExportProductTracking(result.data)
        }
    }

    const toggleCollapse = () => {
        setIsProgressCollapsed(!isProgressCollapsed);
    };

    const toggleOrder = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev)
            if (newSet.has(orderId)) {
                newSet.delete(orderId)
            } else {
                newSet.add(orderId)
            }
            return newSet
        })
    }

    const toggleProduct = (productId) => {
        setExpandedProducts(prev => {
            const newSet = new Set(prev)
            if (newSet.has(productId)) {
                newSet.delete(productId)
            } else {
                newSet.add(productId)
            }
            return newSet
        })
    }

    const handlePrint = () => {
        window.print()
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-blue-500 font-bold">
            <Loader2 className="w-20 h-20 animate-spin" />
        </div>
    }

    if (!warehouseData) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Không tìm thấy thông tin xuất kho</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => navigate("/admin/warehouses/export")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Chi tiết xuất kho</h1>
                        <p className="text-muted-foreground">
                            Mã phiếu: {warehouseData.id}
                        </p>
                    </div>
                </div>
                <Button onClick={handlePrint} className="bg-blue-500 hover:bg-blue-600">
                    <Printer className="mr-2 h-4 w-4" />
                    In phiếu xuất kho
                </Button>
            </div>

            {/* Thông tin cơ bản - Giữ nguyên như cũ */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Thông tin phiếu xuất</CardTitle>
                        <QRCode size={100} value={warehouseData.id}  />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Ngày xuất</p>
                                <p>{warehouseData.export_date ? formatDate(warehouseData.export_date) : '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nhân viên</p>
                                <p>{warehouseData.employee_name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Tổng lợi nhuận</p>
                                <p className="font-semibold text-green-600">
                                    {formatCurrency(warehouseData.total_profit)}
                                </p>
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
                                <a
                                    href={warehouseData.file_authenticate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline flex items-center"
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Xem file xác thực
                                </a>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Không có file xác thực</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            {/* THANH TIẾN TRÌNH XUẤT KHO */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Tiến trình xuất kho</CardTitle>
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
                        className={`overflow-y-auto transition-all duration-300 ease-in-out ${isProgressCollapsed ? 'max-h-[200px]' : 'max-h-none'
                            }`}
                        style={{
                            maxHeight: isProgressCollapsed ? '200px' : 'none'
                        }}
                    >
                        {exportProductTracking.map((item, index) => {
                            return (
                                <ProgressBar
                                    key={index}
                                    title={item.product_name}
                                    target={Number(item.total_serial_need)}
                                    current={Number(item.total_serial_exported)}
                                    index={index}
                                />
                            )
                        })}
                    </div>

                    {/* Gradient overlay khi thu gọn */}
                    {isProgressCollapsed && showToggleButton && (
                        <div className="relative -mt-8 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                </CardContent>
            </Card>
            {/* Danh sách đơn hàng và sản phẩm */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Package className="mr-2 h-5 w-5" />
                        Danh sách đơn hàng và sản phẩm
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {warehouseData.orders.map((order) => (
                            <Collapsible
                                key={order.order_id}
                                open={expandedOrders.has(order.order_id)}
                                onOpenChange={() => toggleOrder(order.order_id)}
                                className="border rounded-lg"
                            >
                                <CollapsibleTrigger className="w-full">
                                    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                                        <div className="flex items-center space-x-4">
                                            {expandedOrders.has(order.order_id) ? (
                                                <ChevronDown className="h-5 w-5" />
                                            ) : (
                                                <ChevronRight className="h-5 w-5" />
                                            )}
                                            <Link
                                                to={`/admin/orders/${order.order_id}`}
                                                className="text-lg font-semibold text-blue-600 hover:underline flex items-center"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Đơn hàng #{order.order_id}
                                                <ExternalLink className="ml-2 h-4 w-4" />
                                            </Link>
                                        </div>
                                        <Badge variant="outline">
                                            {order.products.length} sản phẩm
                                        </Badge>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="p-4 border-t">
                                    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead className="text-right">Số lượng</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Serial</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {order.products.map((product, index) => (
                <>
                    <TableRow key={`product-${index}`}>
                        <TableCell>
                            {/* {product.serials && product.serials.length > 0 && ( */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleProduct(product.product_id)}
                                    className="p-0 h-6 w-6"
                                >
                                    {expandedProducts.has(product.product_id) ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </Button>
                            {/* )} */}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center space-x-2">
                                {product.product_image && (
                                    <img
                                        src={product.product_image}
                                        alt={product.product_name}
                                        className="w-8 h-8 rounded object-cover"
                                    />
                                )}
                                <span>{product.product_name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            {product.quantity}
                        </TableCell>
                        <TableCell>{product.note || '-'}</TableCell>
                        <TableCell>
                            {product.serials && product.serials.length > 0 ? (
                                <Badge variant="outline">
                                    {product.serials.length} serial
                                </Badge>
                            ) : (
                                '-'
                            )}
                        </TableCell>
                    </TableRow>
                    {/* Hiển thị danh sách serial khi mở rộng */}
                    {expandedProducts.has(product.product_id) && (
                    <TableRow key={`serials-${index}`}>
                        <TableCell colSpan={5}>
                            <div className="pl-8 py-2">
                                <div className="text-sm font-medium text-muted-foreground mb-2">
                                    Danh sách serial
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                    {product.serials.map((serial, serialIndex) => (
                                        <Badge
                                            key={serialIndex}
                                            variant="outline"
                                            className="flex items-center justify-center py-1 bg-blue-500 text-white"
                                        >
                                            {serial.serial_number}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                    )}
                </>
            ))}
        </TableBody>
    </Table>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))
                        }
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}