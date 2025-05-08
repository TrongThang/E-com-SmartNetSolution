"use client"

import AddressInfo from "@/components/common/cart/addressInfo"
import CartList from "@/components/common/cart/cartList"
import PaymentSummary from "@/components/common/cart/paymentSummary"


export default function CartPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CartList />
                    {/* <AddressInfo /> */}
                </div>

                <div className="lg:col-span-1">
                    <PaymentSummary />
                </div>
            </div>
        </div>
    )
}
