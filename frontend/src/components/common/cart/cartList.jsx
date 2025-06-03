"use client"

import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import CartItem from "./cartItem"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, ShoppingCart, Package } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CartList() {
    const { cart, clearSelected, selectAll, removeSelected } = useCart()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = Number(searchParams.get("page")) || 1
    const [itemsPerPage] = useState(5)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = cart.items.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(cart.items.length / itemsPerPage)

    const allSelected = cart.items.length > 0 && cart.items.every((item) => item.selected)
    const someSelected = cart.items.some((item) => item.selected)

    const handleToggleAll = () => {
        if (allSelected) {
            clearSelected()
        } else {
            selectAll()
        }
    }

    const handlePageChange = (page) => {
        setSearchParams({ page: page.toString() })
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <Card className="bg-white shadow-md">
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Giỏ hàng trống</h3>
                    <p className="text-muted-foreground mb-6">Không có sản phẩm nào trong giỏ hàng của bạn</p>
                    <Button asChild>
                        <a href="/products">Tiếp tục mua sắm</a>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white shadow-md">
            <CardHeader className="border-b px-4 py-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="select-all"
                        checked={allSelected}
                        onCheckedChange={handleToggleAll}
                        aria-label="Chọn tất cả sản phẩm"
                    />
                    <label htmlFor="select-all" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                        <Package className="h-4 w-4" />
                        Chọn tất cả ({cart.items.length})
                    </label>
                </div>

                <Button
                    variant="destructive" size="sm"
                    onClick={removeSelected} disabled={!someSelected} className="h-8">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa đã chọn
                </Button>
            </CardHeader>

            <CardContent className="p-0">
                {someSelected && (
                    <Alert className="m-4 bg-blue-50 border-blue-200">
                        <AlertTitle className="text-blue-700">
                            Đã chọn {cart.items.filter((item) => item.selected).length} sản phẩm
                        </AlertTitle>
                        <AlertDescription className="text-blue-600">
                            Các sản phẩm đã chọn sẽ được tính vào tổng thanh toán
                        </AlertDescription>
                    </Alert>
                )}

                <div className="divide-y">
                    {currentItems.map((item) => (
                        <CartItem key={item.id} product={item} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t">
                        <Pagination>
                            <PaginationContent>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
