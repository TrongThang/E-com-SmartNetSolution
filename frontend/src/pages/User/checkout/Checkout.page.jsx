"use client"

import { useState } from "react"
import { CreditCard, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"

import { OrderSummary } from "@/components/common/checkout/OrderSummary"
import { ShippingForm } from "@/components/common/checkout/ShippingForm"
import { PaymentForm } from "@/components/common/checkout/PaymentForm"
import { CheckoutSummary } from "@/components/common/checkout/CheckoutSummary"
import { CheckoutSteps } from "@/components/common/checkout/CheckoutSteps"
import CheckoutSuccess from "@/pages/user/checkout/success/CheckoutSuccess"
import { useCart } from "@/contexts/CartContext"
import Swal from "sweetalert2"
import axiosPublic from "@/apis/clients/public.client"
export default function CheckoutPage() {
    const { getItemSelected, removeSelected } = useCart()
    const products = getItemSelected()

    const [currentStep, setCurrentStep] = useState("shipping")
    const [shippingData, setShippingData] = useState(null)
    const [paymentData, setPaymentData] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const handleNextStep = (nextStep) => setCurrentStep(nextStep)
    const [resultOrder, setResultOrder] = useState(null)

    // Nhận dữ liệu từ ShippingForm
    const handleShippingComplete = (data) => {
        setShippingData(data)
        handleNextStep("payment")
    }

    // Nhận dữ liệu từ PaymentForm
    const handlePaymentComplete = (data) => {
        setPaymentData(data)
        handleNextStep("review")
    }

    const handleCompleteCheckout = async () => {
        try {
            const cartTotal = products.reduce((total, item) => total + item.price * item.quantity, 0)
            const shippingFee = shippingData?.shippingMethod === 'standard' ? 30000 : 50000

            const payload = {
                shipping: shippingData,
                payment: paymentData,
                products: products,
                order: {
                    customer_id: "CUST5QL4N3FV51NLUY895SCRHZFV",
                    export_date: new Date(),
                    total_money: cartTotal,
                    discount: 0,
                    vat: 0,
                    amount: cartTotal + shippingFee,
                    status: 0, // PENDING
                }
            }
            
            const res = await axiosPublic.post("/order/checkout", payload)

            if (res.status_code === 200) {
                removeSelected()
                setIsSuccess(true)
                setResultOrder(res.data)
                console.log("res.data:", res.data)
            } else {
                if (res.errors &&res?.errors.length === 1) {
                    return Swal.fire({
                        icon: 'error',
                        title: 'Có lỗi xảy ra!',
                        text: res.errors[0].message,
                    })
                }

                const errorList = res.data_errors.map(productError => 
                    `<div class="mb-4 rounded-lg border border-red-100 bg-red-50 p-4">
                        <div class="mb-2 flex items-center gap-2 text-red-800">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span class="font-semibold">${productError.product_name}</span>
                        </div>
                        <div class="space-y-2">
                            ${productError.errors.map(error => 
                                `<div class="flex items-center gap-2 text-sm text-red-600">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>${error.message}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>`
                ).join('') || 'Có lỗi xảy ra';
            
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra!',
                    html: `
                        <div class="max-h-[60vh] overflow-y-auto px-1">
                            ${errorList}
                        </div>
                    `,
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    },
                    customClass: {
                        popup: '!rounded-lg !p-6',
                        title: '!text-xl !font-semibold !text-gray-800',
                        confirmButton: '!bg-red-600 hover:!bg-red-700 !text-white !font-medium !px-6 !py-2.5 !rounded-lg !transition-colors',
                        closeButton: '!text-gray-400 hover:!text-gray-600',
                        container: '!font-sans'
                    },
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#dc2626', // red-600
                    showCloseButton: true,
                    focusConfirm: false,
                    allowOutsideClick: true,
                    allowEscapeKey: true,
                    allowEnterKey: true,
                    stopKeydownPropagation: true,
                })
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: "Có lỗi khi gửi dữ liệu thanh toán! " + err,
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#3085d6',
                // Thêm các tùy chỉnh khác
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                customClass: {
                    confirmButton: 'btn btn-danger'
                }
            });
        }
    }   

    return (
        isSuccess ? (
            <CheckoutSuccess resultOrder={resultOrder} shipping={shippingData} payment={paymentData} />
        ) : (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Thanh Toán</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="mb-6">
                        <CheckoutSteps currentStep={currentStep} />
                    </Card>

                    <Tabs value={currentStep} className="w-full">
                        <TabsContent value="shipping" className="mt-0">
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Thông Tin Giao Hàng</h2>
                                <ShippingForm onComplete={handleShippingComplete} />
                            </Card>
                        </TabsContent>

                        <TabsContent value="payment" className="mt-0">
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Phương Thức Thanh Toán</h2>
                                <PaymentForm onComplete={handlePaymentComplete} onBack={() => handleNextStep("shipping")} />
                            </Card>
                        </TabsContent>

                        <TabsContent value="review" className="mt-0">
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Xác Nhận Đơn Hàng</h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-medium mb-2">Thông Tin Giao Hàng</h3>
                                        <div className="bg-muted p-4 rounded-md">
                                            <p> {shippingData?.fullName} </p>
                                            <p> {shippingData?.phone} </p>
                                            <p> {shippingData?.address}, {shippingData?.city}, {shippingData?.district}, {shippingData?.ward} </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-2">Phương Thức Thanh Toán</h3>
                                        <div className="bg-muted p-4 rounded-md flex items-center">
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            <span> {paymentData?.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán online' } </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-2">Phương Thức Vận Chuyển</h3>
                                        <div className="bg-muted p-4 rounded-md flex items-center">
                                            <Truck className="mr-2 h-5 w-5" />
                                            <span> {shippingData?.shippingMethod === 'standard' ? 'Giao hàng tiêu chuẩn' : 'Giao hàng nhanh' } </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <Button variant="outline" onClick={() => handleNextStep("payment")}>
                                            Quay Lại
                                        </Button>
                                        <Button onClick={handleCompleteCheckout}>Hoàn Tất Đơn Hàng</Button>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="lg:col-span-1">
                    <OrderSummary cartItems={products} />
                    <CheckoutSummary shippingFee={shippingData?.shippingMethod === 'standard' ? 30000 : 50000} />
                </div>
            </div>
        </div>)
    )
}
