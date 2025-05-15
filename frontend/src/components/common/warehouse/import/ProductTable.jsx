"use client"

import { useState } from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductItem } from "@/components/common/warehouse/import/ProductItem"

export function ProductTable({
    products,
    onUpdateProduct,
    onRemoveProduct,
    onUpdateSerialNumbers,
    onUpdateBarcode,
}) {
    const [expandedProducts, setExpandedProducts] = useState([])

    // Toggle product expansion
    const toggleProductExpansion = (productId) => {
        if (expandedProducts.includes(productId)) {
            setExpandedProducts(expandedProducts.filter((id) => id !== productId))
        } else {
            setExpandedProducts([...expandedProducts, productId])
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="w-[100px] text-right">Số lượng</TableHead>
                    <TableHead className="w-[150px] text-right">Đơn giá</TableHead>
                    <TableHead className="w-[150px] text-right">Thành tiền</TableHead>
                    <TableHead className="w-[80px] text-center">Quà tặng</TableHead>
                    <TableHead className="w-[80px]">Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <ProductItem
                        key={product.id}
                        product={product}
                        isExpanded={expandedProducts.includes(product.id)}
                        onToggleExpand={() => toggleProductExpansion(product.id)}
                        onUpdateProduct={onUpdateProduct}
                        onRemoveProduct={onRemoveProduct}
                        onUpdateSerialNumbers={onUpdateSerialNumbers}
                        onUpdateBarcode={onUpdateBarcode}
                    />
                ))}
            </TableBody>
        </Table>
    )
}
