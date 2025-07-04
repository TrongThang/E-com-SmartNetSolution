"use client"

import { useState, useEffect, Fragment } from "react"
import { useParams, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReviewSection from "@/components/common/reviews/ReviewSection"
import productApi from "@/apis/modules/product.api.ts"
import ProductDetails from "@/components/common/product/ProductDetail";
import SpecificationsTab from "@/components/common/product/SpecificationsTab";

export default function ProductDetailPage() {
    const params = useParams();
    const location = useLocation();
    const [device, setDevice] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("description")

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.getBySlug(params.slug);
                console.log("response: ", response)
                setDevice(response.data.data[0])
            } catch (error) {
                console.error("Error fetching device:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (params.slug) {
            fetchDevice()
        }
    }, [params.slug])

    // Handle anchor navigation
    useEffect(() => {
        const hash = location.hash.replace('#', '')
        if (hash === 'reviews' || hash === 'specifications' || hash === 'description') {
            setActiveTab(hash)
        }
    }, [location.hash])

    const handleTabChange = (value) => {
        setActiveTab(value)
        // Update URL hash without triggering navigation
        window.history.replaceState(null, null, `#${value}`)
    }

    if (isLoading) {
        return (
            <Fragment>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Fragment>
        )
    }

    if (!device) {
        return (
            <Fragment>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Sản phẩm không tồn tại</h2>
                        <p className="mt-2 text-gray-600">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    </div>
                </div>
            </Fragment>
        )
    }

    return (
        <Fragment>
            <div className="container mx-auto py-8 px-4 pt-28">
                {/* Product details would go here */}
                <ProductDetails device={device} />

                <div className="mt-10">
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="description">Mô tả</TabsTrigger>
                            <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
                            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="p-6 bg-white rounded-lg shadow-sm mt-4">
                            <h2 className="text-xl font-bold mb-4">Mô tả sản phẩm</h2>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: device.description }} />
                        </TabsContent>

                        <TabsContent value="specifications" className="p-6 bg-white rounded-lg shadow-sm mt-4">
                            <h2 className="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
                            <SpecificationsTab specifications={device.specifications} />
                        </TabsContent>

                        <TabsContent value="reviews" className="p-6 bg-white rounded-lg shadow-sm mt-4">
                            <h2 className="text-xl font-bold mb-4">Đánh giá từ khách hàng</h2>
                            <ReviewSection device={device} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}