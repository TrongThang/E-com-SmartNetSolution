"use client"

import CartList from "@/components/common/cart/cartList"
import PaymentSummary from "@/components/common/cart/paymentSummary"
import { useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { Loader2 } from "lucide-react"

export default function CartPage() {
    const { initializeCart, isInitialized } = useCart()

    useEffect(() => {
        initializeCart()
    }, [])

    if (!initializeCart) {
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
        </div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CartList />
                </div>

                <div className="lg:col-span-1">
                    <PaymentSummary />
                </div>
            </div>
        </div>
    )
}
