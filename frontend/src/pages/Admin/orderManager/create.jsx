// create.jsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Package, CreditCard } from "lucide-react"
import { useNavigate } from "react-router-dom"
import OrderSteps from "@/components/common/order/OrderSteps"
import CustomerStep from "@/components/common/order/steps/CustomerStep"
import ProductsStep from "@/components/common/order/steps/ProductsStep"
import ShippingStep from "@/components/common/order/steps/ShippingStep"
import PaymentStep from "@/components/common/order/steps/PaymentStep"


export default function CreateOrderForm() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [orderData, setOrderData] = useState({
        customer: {
            customer_id: "",
            name: "",
            phone: "",
            email: "",
        },
        products: [],
        shipping: {
            name_recipient: "",
            phone: "",
            address: "",
            ward: "",
            district: "",
            city: "",
            shippingMethod: "standard",
        },
        payment: {
            payment_method: "CASH",
            payment_account: "",
            prepaid: 0,
            remaining: 0,
        },
        order: {
            discount: 0,
            vat: 0,
            note: "",
            platform_order: "WEB",
            saler_id: "",
            shipper_id: "",
        },
    })

    const steps = [
        { id: 1, title: "Thông tin khách hàng", icon: User },
        { id: 2, title: "Sản phẩm", icon: Package },
        { id: 3, title: "Giao hàng", icon: Package },
        { id: 4, title: "Thanh toán", icon: CreditCard },
    ]

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const handleSubmit = async () => {
        console.log("Creating order:", orderData)
    }

    return (
        <div className="space-y-6">
            <OrderSteps currentStep={currentStep} setCurrentStep={setCurrentStep} orderData={orderData} setOrderData={setOrderData} steps={steps} />

            <div className="min-h-[400px]">
                {currentStep === 1 && (
                    <CustomerStep 
                        orderData={orderData} 
                        setOrderData={setOrderData} 
                    />
                )}
                {currentStep === 2 && (
                    <ProductsStep 
                        orderData={orderData} 
                        setOrderData={setOrderData} 
                    />
                )}
                {currentStep === 3 && (
                    <ShippingStep 
                        orderData={orderData} 
                        setOrderData={setOrderData} 
                    />
                )}
                {currentStep === 4 && (
                    <PaymentStep 
                        orderData={orderData} 
                        setOrderData={setOrderData} 
                    />
                )}
            </div>

            <div className="flex justify-between">
                <Button 
                    variant="outline" 
                    onClick={prevStep} 
                    disabled={currentStep === 1}
                >
                    Quay lại
                </Button>
                <div className="flex gap-2">
                    {currentStep === 4 ? (
                        <Button onClick={handleSubmit}>Tạo đơn hàng</Button>
                    ) : (
                        <Button onClick={nextStep}>Tiếp theo</Button>
                    )}
                </div>
            </div>
        </div>
    )
}