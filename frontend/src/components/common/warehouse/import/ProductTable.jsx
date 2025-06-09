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


    return (
        <Table className="w-[40vw]">
            <TableHeader>
                <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="w-[100px] text-right">Số lượng</TableHead>
                    <TableHead className="w-[80px]">Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <ProductItem
                        key={product.id}
                        product={product}
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