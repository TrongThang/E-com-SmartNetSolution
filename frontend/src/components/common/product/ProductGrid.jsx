import { ProductCard } from "@/components/common/product/ProductCard";

export default function ProductGrid({ products, columns = 4 }) {
    return (
        <div
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}