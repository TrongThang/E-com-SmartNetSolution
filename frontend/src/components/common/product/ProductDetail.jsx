"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Star } from "lucide-react"
import { formatCurrency } from "@/utils/format"
import { useCart } from "@/contexts/CartContext"
import LikedApi from "@/apis/modules/liked.api.ts"

export default function ProductDetails({ device }) {
    const { addToCart } = useCart();
    const [selectedImage, setSelectedImage] = useState(
        { id: "main", url: device.image || "/placeholder.svg", alt: "Main image" }
    );
    const [isLiked, setIsLiked] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = async () => {
        try {
            const productData = {
                id: device.id,
                name: device.name,
                price: device.selling_price,
                quantity: quantity // Kiểm tra giá trị này
            };
            await addToCart(productData);
        } catch (error) {
            console.log("Lỗi: ", error)
        }
    };


    const handleLike = async () => {
        try {
            const res = await LikedApi.add(device.id);
        } catch (error) {
            console.log("Lỗi: ", error)
        }
    }

    // // Tính giá sau khi giảm giá
    // const discountedPrice = device.discount ? device.price * (1 - device.discount / 100) : device.price

    // Tính điểm đánh giá trung bình
    const averageRating = device.average_rating || 0
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 p-6">
                {/* Phần hình ảnh */}
                <div className="space-y-4">
                    <div className="relative h-[400px] w-full border rounded-lg overflow-hidden">
                        <img
                            src={selectedImage.url || selectedImage.image}
                            alt={selectedImage.alt}
                            className="object-contain w-full h-full"
                        />
                    </div>

                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {device.images?.map((image) => (
                            <button
                                key={image.id}
                                className={`relative h-20 w-20 border rounded-md overflow-hidden flex-shrink-0 ${selectedImage.id === image.id
                                    ? "border-blue-600 ring-2 ring-blue-600"
                                    : "border-gray-200"
                                    }`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <img
                                    src={image.image || "/placeholder.svg"}
                                    alt={image.alt}
                                    className="object-cover w-full h-full"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Phần thông tin sản phẩm */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{device.name}</h1>

                        <div className="flex items-center mt-2 space-x-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-4 w-4 ${star <= Math.round(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            {/* <span className="text-sm text-gray-600">({device.reviews.length} đánh giá)</span> */}
                            <span className="text-sm text-gray-600">| Đã bán: {device.sold}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {device.discount ? (
                            <>
                                <div className="flex items-center space-x-2">
                                    {/* <span className="text-3xl font-bold text-red-600">{formatCurrency(discountedPrice)}</span> */}
                                    <span className="text-sm px-2 py-1 bg-red-100 text-red-600 rounded-md">-{device.discount}%</span>
                                </div>
                                <div className="text-gray-500 line-through">{formatCurrency(device.selling_price)}</div>
                            </>
                        ) : (
                            <div className="text-3xl font-bold text-gray-900">{formatCurrency(device.selling_price)}</div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div className="text-gray-700">Số lượng:</div>
                            <div className="flex items-center">
                                <button
                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </button>
                                <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300">
                                    {quantity}
                                </div>
                                <button
                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <div className="text-gray-600 text-sm">{device.stock} sản phẩm có sẵn</div>
                        </div>
                    </div>
                    <Button
                        className={`h-16 w-16 ${isLiked
                            ? "border-red-500 text-red-500"
                            : "border-dark-400 text-dark-400"
                            }`} // Đổi màu viền và text
                        variant="outline"
                        size="icon"
                        onClick={() => setIsLiked(!isLiked)}
                    >
                        <Heart
                            className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-dark-400 fill-transparent"}`}
                        />
                    </Button>
                    <div className="flex space-x-4 pt-6">
                        <Button
                            className="flex-1 max-w-xs bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white h-20"
                            onClick={() => handleAddToCart(device, quantity)}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Thêm vào giỏ hàng
                        </Button>

                        <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white max-w-xs h-20"
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Mua ngay
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
