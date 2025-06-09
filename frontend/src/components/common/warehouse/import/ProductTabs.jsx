"use client"

import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductList } from "@/components/common/warehouse/import/ProductList"

export function ProductsTab({
    products,
    onAddProduct,
    onUpdateProduct,
    onRemoveProduct,
    onBack,
    onSubmit,
    isSubmitDisabled,
    isSubmitting,
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Danh sách sản phẩm nhập kho</CardTitle>
                <CardDescription>
                    {products.length > 0 ? `${products.length} sản phẩm được chọn` : "Chưa có sản phẩm nào được chọn"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ProductList
                    products={products}
                    onAddProduct={onAddProduct}
                    onUpdateProduct={onUpdateProduct}
                    onRemoveProduct={onRemoveProduct}
                />

                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={onBack}>
                        Quay lại
                    </Button>
                    <Button onClick={onSubmit} disabled={isSubmitDisabled}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Lưu phiếu nhập
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}