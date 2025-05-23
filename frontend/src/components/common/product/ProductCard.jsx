import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import StarRating from "../reviews/StarRating";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
export function ProductCard({ product }) {
    const { id, image, name, selling_price, slug, description, total_review, categories, average_rating, sold } = product;
    return (
        <Link to={`/products/${id}`}>
        <Card className="h-full overflow-hidden border border-gray-200 transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100">
            <div className="relative aspect-square overflow-hidden bg-gray-100 p-4 max-h-[15vh]">
                <img
                    src={image || "/placeholder.svg"}
                    alt={name}
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw 20vh"
                />
            </div>
            <CardContent className="p-4">
                <Link to={`/products/${id}`}>
                    <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-gray-900 hover:text-blue-600">{name}</h3>
                </Link>
                <p className="mt-1 text-base font-bold text-gray-900">{ formatCurrency(selling_price) }</p>
                <div className="mt-1 flex items-center gap-1">
                    <StarRating rating={average_rating} />
                    <span className="ml-1 text-xs text-gray-500">({total_review})</span>
                </div>
                {description && <p className="mt-2 line-clamp-2 text-xs text-gray-500">{description}</p>}
                <p className="mt-2 text-xs text-gray-500">Đã bán: {sold}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button
                    variant="default"
                    className="w-full bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-md"
                    asChild
                >
                    <Link to={`/products/${id}`}>Chi tiết</Link>
                </Button>
            </CardFooter>
            </Card>
        </Link>
    );
}
