
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, Save } from "lucide-react"
import PropTypes from 'prop-types'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BasicInfoForm } from "@/components/common/warehouse/import/BasicInfoForm"
import { ProductsTab } from "@/components/common/warehouse/import/ProductTabs"
import { ConfirmationDialog } from "@/components/common/warehouse/ConfirmationDialog"
import axiosPublic from "@/apis/clients/public.client"
import Swal from "sweetalert2"

export default function CreateImportWarehousePage() {
    const router = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [activeTab, setActiveTab] = useState("basic-info")

    // Form state
    const [formData, setFormData] = useState({
        employee_id: "",
        warehouse_id: "",
        import_date: new Date(),
        file_authenticate: "",
        total_money: 0,
        note: "",
        products: [], // Removed TypeScript type annotation
    })

    // Handle form field changes
    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // Handle adding a product
    const handleAddProduct = (product) => {
        setFormData((prev) => {
            // Check if product already exists
            const existingProductIndex = prev.products.findIndex((p) => p.id === product.id)

            if (existingProductIndex >= 0) {
                // Update existing product
                const updatedProducts = [...prev.products]
                updatedProducts[existingProductIndex] = {
                    ...updatedProducts[existingProductIndex],
                    quantity: updatedProducts[existingProductIndex].quantity + 1,
                }

                return {
                    ...prev,
                    products: updatedProducts,
                }
            } else {
                // Add new product
                const newProduct = {
                    ...product,
                    quantity: 1,
                    note: product.note || "",
                }

                return {
                    ...prev,
                    products: [...prev.products, newProduct],
                }
            }
        })

        // Move to products tab after adding
        setActiveTab("products")
    }

    // Handle product update
    const handleProductUpdate = (productId, field, value) => {
        setFormData((prev) => {
            const updatedProducts = prev.products.map((product) => {
                if (product.id === productId) {
                    const updatedProduct = { ...product, [field]: value }
                    return updatedProduct
                }
                return product
            })

            return {
                ...prev,
                products: updatedProducts,
            }
        })
    }

    // Handle product removal
    const handleRemoveProduct = (productId) => {
        setFormData((prev) => {
            const updatedProducts = prev.products.filter((product) => product.id !== productId)

            return {
                ...prev,
                products: updatedProducts,
            }
        })
    }

    // Submit form
    const handleSubmit = async () => {
        setIsSubmitting(true)

        try {
            // Prepare data for submission
            const importWarehouseData = {
                employee_id: formData.employee_id,
                warehouse_id: formData.warehouse_id,
                import_date: formData.import_date,
                file_authenticate: formData.file_authenticate,
                total_money: formData.total_money,
                note: formData.note,
                detail_import: formData.products.map((product) => ({
                    product_id: product.id,
                    quantity: product.quantity,
                    note: product.note || "",
                })),
            }
            
            const response = await axiosPublic.post("/import-warehouse", { data: importWarehouseData })
            console.log("Response:", response)

            if (response.status_code === 200) {
                Swal.fire({
                    title: "Thành công",
                    text: "Phiếu nhập kho đã được tạo thành công",
                    icon: "success",
                })
            } else {
                Swal.fire({
                    title: "Lỗi",
                    text: response.errors[0].message,
                    icon: "error",
                })
            }
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Validate form before submission
    const validateForm = () => {
        if (!formData.employee_id) return false
        if (!formData.warehouse_id) return false
        if (formData.products.length === 0) return false

        // Check if all products have valid quantity and price
        for (const product of formData.products) {
            if (!product.quantity || product.quantity <= 0) return false

            // Check if all serial numbers are provided for products that require them
            if (product.requires_serial && product.serial_numbers.length !== product.quantity) {
                return false
            }
        }

        return true
    }

    // Calculate total products and total items
    const getTotalStats = () => {
        const totalProducts = formData.products.length
        const totalItems = formData.products.reduce((sum, product) => sum + (product.quantity || 0), 0)
        const totalSerialNumbers = formData.products.reduce(
            (sum, product) => sum + (product.serial_numbers?.length || 0),
            0,
        )

        return { totalProducts, totalItems, totalSerialNumbers }
    }

    const { totalProducts, totalItems, totalSerialNumbers } = getTotalStats()

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Tạo Phiếu Nhập Kho</h1>
                    {formData.products.length > 0 && (
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{totalProducts} sản phẩm</Badge>
                            <Badge variant="outline">{totalItems} đơn vị</Badge>
                            {totalSerialNumbers > 0 && <Badge variant="outline">{totalSerialNumbers} serial đã nhập</Badge>}
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push("/warehouse/import")}>
                        Hủy
                    </Button>
                    <Button onClick={() => setShowConfirmDialog(true)} disabled={!validateForm() || isSubmitting}>
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
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="basic-info">Thông tin cơ bản</TabsTrigger>
                    <TabsTrigger value="products">
                        Sản phẩm
                        {formData.products.length > 0 && (
                            <Badge variant="outline" className="ml-2">
                                {formData.products.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic-info">
                    <BasicInfoForm formData={formData} onChange={handleChange} onNext={() => setActiveTab("products")} />
                </TabsContent>

                <TabsContent value="products">
                    <ProductsTab
                        products={formData.products}
                        onAddProduct={handleAddProduct}
                        onUpdateProduct={handleProductUpdate}
                        onRemoveProduct={handleRemoveProduct}
                        onBack={() => setActiveTab("basic-info")}
                        onSubmit={() => setShowConfirmDialog(true)}
                        isSubmitDisabled={!validateForm() || isSubmitting}
                        isSubmitting={isSubmitting}
                    />
                </TabsContent>
            </Tabs>

            <ConfirmationDialog
                title="tạo phiếu nhập kho"
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                count={formData.products.length}
                type="sản phẩm"
                onSubmit={handleSubmit}
            />
        </div>
    )
}

// PropTypes for child components
ProductsTab.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        import_price: PropTypes.number.isRequired,
        amount: PropTypes.number.isRequired,
        is_gift: PropTypes.bool.isRequired,
        batch_code: PropTypes.string.isRequired,
        serial_numbers: PropTypes.arrayOf(PropTypes.string).isRequired,
        barcode: PropTypes.string,
        note: PropTypes.string,
        requires_serial: PropTypes.bool,
        price: PropTypes.number
    })).isRequired,
    onAddProduct: PropTypes.func.isRequired,
    onUpdateProduct: PropTypes.func.isRequired,
    onRemoveProduct: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isSubmitDisabled: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired
}

ConfirmationDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    productCount: PropTypes.number.isRequired
}

BasicInfoForm.propTypes = {
    formData: PropTypes.shape({
        import_number: PropTypes.string.isRequired,
        import_id: PropTypes.string.isRequired,
        employee_id: PropTypes.string.isRequired,
        warehouse_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        import_date: PropTypes.instanceOf(Date).isRequired,
        file_authenticate: PropTypes.any,
        note: PropTypes.string,
        products: PropTypes.array.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired
}
