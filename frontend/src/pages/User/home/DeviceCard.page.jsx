import { Link } from "react-router-dom"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const DeviceCard = ({ product }) => {
    return (
        <Link to="#" className="group">
            <Card className="overflow-hidden transition-all hover:shadow-md border-0 rounded-xl">
                <div className="relative">
                    {product.oldPrice && (
                        <Badge className="absolute right-2 top-2 bg-blue-500 text-white">Giảm giá</Badge>
                    )}
                    <img
                        src={`/placeholder.svg?height=200&width=200&text=${product.name}`}
                        alt={product.name}
                        className="h-[200px] w-full object-cover"
                    />
                </div>
                <CardContent className="p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-800 group-hover:text-blue-600">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-blue-600">{product.price}đ</span>
                        {product.oldPrice && (
                            <span className="text-sm text-gray-500 line-through">{product.oldPrice}đ</span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-amber-400">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <Star className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs text-gray-500">Đã bán: {product.sold}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default DeviceCard