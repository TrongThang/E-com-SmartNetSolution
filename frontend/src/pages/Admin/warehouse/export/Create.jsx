"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BasicInfoForm } from "@/components/common/warehouse/export/BasicInfoForm"
import { OrderSelectionCard } from "@/components/common/warehouse/export/OrderSelectionCard"
import { OrderList } from "@/components/common/warehouse/export/OrderList"
import { ConfirmationDialog } from "@/components/common/warehouse/ConfirmationDialog"
import { ExportHeader } from "@/components/common/warehouse/export/ExportHeader"
import Swal from "sweetalert2"
import axiosPublic from "@/apis/clients/public.client"

export default function CreateExportWarehousePage() {
    const router = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        employee_id: "",
        export_date: new Date(),
        file_authenticate: "",
        total_profit: 0,
        note: "",
        orders: [],
    })

    // Handle form field changes
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Handle order selection
    const handleOrderSelect = (order) => {
        if (!formData.orders.find((o) => o.id === order.id)) {
            setFormData((prev) => ({
                ...prev,
                orders: [
                    ...prev.orders,
                    {
                        ...order,
                        products: order.products.map((p) => ({
                            ...p,
                            batch_product_details: [],
                        })),
                    },
                ],
            }))
        }
    }

    // Handle order removal
    const handleRemoveOrder = (orderId) => {
        setFormData((prev) => ({
            ...prev,
            orders: prev.orders.filter((order) => order.id !== orderId),
        }))
    }

    // Handle batch product detail update
    const handleBatchDetailUpdate = (orderId, productId, batchDetails) => {
        setFormData((prev) => ({
            ...prev,
            orders: prev.orders.map((order) => {
                if (order.id === orderId) {
                    return {
                        ...order,
                        products: order.products.map((product) => {
                            if (product.id === productId) {
                                return {
                                    ...product,
                                    batch_product_details: batchDetails,
                                }
                            }
                            return product
                        }),
                    }
                }
                return order
            }),
        }))
    }

    // Calculate total profit
    const calculateTotalProfit = () => {
        let total = 0
        formData.orders.forEach((order) => {
            order.products.forEach((product) => {
                const profit = product.batch_product_details.reduce((sum, detail) => {
                    return sum + (detail.sale_price - detail.import_price)
                }, 0)
                total += profit
            })
        })
        return total
    }

    // Submit form
    const handleSubmit = async () => {
        setIsSubmitting(true)

        try {
            const totalProfit = calculateTotalProfit()
            const dataToSubmit = {
                ...formData,
                total_profit: totalProfit,
            }

            // API call would go here
            console.log("Submitting data:", dataToSubmit)
            
            const response = await axiosPublic.post("/export-warehouse", { data: dataToSubmit })

            if (response.status_code === 200) {
                Swal.fire({
                    title: "Thành công",
                    text: "Phiếu xuất kho đã được tạo thành công",
                    icon: "success",
                })
                
                console.log('result:', response)
            } else {
                Swal.fire({
                    title: "Lỗi",
                    text: response.errors[0].message,
                    icon: "error",
                })
            }

            // Success - redirect to list page
            // router.push("/warehouse/export")
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Validate form before submission
    const validateForm = () => {
        if (!formData.employee_id) return false
        if (formData.orders.length === 0) return false

        // Check if all products have batch details
        for (const order of formData.orders) {
            for (const product of order.products) {
                if (product.batch_product_details.length !== product.quantity) {
                    return false
                }
            }
        }

        return true
    }

    // Calculate total products and scanned products
    const getTotalStats = () => {
        let totalProducts = 0
        let totalScanned = 0

        formData.orders.forEach((order) => {
            order.products.forEach((product) => {
                totalProducts += product.quantity
                totalScanned += product.batch_product_details.length
            })
        })

        return { totalProducts, totalScanned }
    }

    const { totalProducts, totalScanned } = getTotalStats()

    return (
        <div className="container mx-auto p-4">
            <ExportHeader 
                orders={formData.orders}
                totalProducts={totalProducts}
                totalScanned={totalScanned}
                isSubmitting={isSubmitting}
                validateForm={validateForm}
                onCancel={() => router.push("/warehouse/export")}
                onConfirm={() => setShowConfirmDialog(true)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="md:col-span-1 space-y-6">
                    <BasicInfoForm 
                        formData={formData}
                        onChange={handleChange}
                    />
                    <OrderSelectionCard 
                        onOrderSelect={handleOrderSelect}
                        selectedOrders={formData.orders}
                    />
                </div>

                {/* Right column */}
                <div className="md:col-span-2">
                    <OrderList 
                        orders={formData.orders}
                        onRemoveOrder={handleRemoveOrder}
                        onBatchDetailUpdate={handleBatchDetailUpdate}
                    />
                </div>
            </div>

            <ConfirmationDialog 
                title="tạo phiếu xuất kho"
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                count={formData.orders.length}
                type="đơn hàng"
                onSubmit={handleSubmit}
            />
        </div>
    )
}