"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductTable } from "@/components/common/warehouse/import/ProductTable"
import { ProductSelector } from "@/components/common/warehouse/import/ProductSelector"

export function ProductList({
    products,
    onAddProduct,
    onUpdateProduct,
    onRemoveProduct,
    onUpdateSerialNumbers,
    onUpdateBarcode,
}) {
    const [showProductDialog, setShowProductDialog] = useState(false)
    
    return (
        <div className="space-y-4">
            {products.length > 0 ? (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Danh sách sản phẩm đã chọn</h3>
                        <Button onClick={() => setShowProductDialog(true)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Thêm sản phẩm
                        </Button>
                    </div>

                    <ProductTable
                        products={products}
                        onUpdateProduct={onUpdateProduct}
                        onRemoveProduct={onRemoveProduct}
                        onUpdateSerialNumbers={onUpdateSerialNumbers}
                        onUpdateBarcode={onUpdateBarcode}
                    />
                </>
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Chưa có sản phẩm nào được thêm vào phiếu nhập kho</p>
                    <Button onClick={() => setShowProductDialog(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm sản phẩm
                    </Button>
                </div>
            )}

            <ProductSelector open={showProductDialog} onOpenChange={setShowProductDialog} onProductSelect={onAddProduct} />
        </div>
    )
}