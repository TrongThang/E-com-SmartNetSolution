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
import axiosPrivate from "@/apis/clients/private.client"
import employeePrivate from "@/apis/clients/employeePrivate.client"

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

    // Submit form
    const handleSubmit = async () => {
        setIsSubmitting(true)

        try {
            const dataToSubmit = {
                ...formData
            }

            // API call would go here
            const response = await employeePrivate.post("/export-warehouse", { data: dataToSubmit })

            if (response.status_code === 200) {
                Swal.fire({
                    title: "Thành công",
                    text: "Phiếu xuất kho đã được tạo thành công",
                    icon: "success",
                })
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
            Swal.fire({
                title: "Lỗi",
                text: error.message,
                icon: "error",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Validate form before submission
    const validateForm = () => {
        if (!formData.employee_id) return false
        if (formData.orders.length === 0) return false

        return true
    }

    // Calculate total products and scanned products
    const getTotalStats = () => {
        let totalProducts = 0

        formData.orders.forEach((order) => {
            order.products.forEach((product) => {
                totalProducts += product.quantity
            })
        })

        return { totalProducts }
    }

    const { totalProducts } = getTotalStats()

    return (
        <div className="container mx-auto p-4">
            <ExportHeader 
                orders={formData.orders}
                totalProducts={totalProducts}
                isSubmitting={isSubmitting}
                validateForm={validateForm}
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