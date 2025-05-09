import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/utils/format";

export default function CartItem({ product }) {
    const { updateQuantity, removeFromCart } = useCart();
    
    const handleInputQuantity = (value) => {
        const quantity = Number(value) || 0;
        if (quantity > product.stock) {
            alert("Số lượng không hợp lệ")
            return
        }
        updateQuantity(product.id, quantity)
    }

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-20 h-20 object-cover rounded"
                />
                <div>
                    <Link to={`/products/${product.slug}`} className="text-lg font-medium hover:text-blue-600">
                        {product.name}
                    </Link>
                    {product.status <= 0 && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded">Ngừng bán</span>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    {product.quantity >= product.stock && (
                        <p className="text-red-500 text-sm">Còn {product.stock} thiết bị</p>
                    )}
                    <div className="flex items-center border rounded">
                        <button
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => updateQuantity(product.id, product.quantity - 1)}
                            disabled={product.quantity <= 1}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            className="w-12 text-center border-x py-1"
                            value={product.quantity}
                            onChange={(e) => handleInputQuantity(e.target.value)}
                            min="1"
                            max={product.stock}
                        />
                        <button
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => updateQuantity(product.id, product.quantity + 1)}
                            disabled={product.quantity >= product.stock}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.price)}</p>
                    <p className="text-lg font-bold text-red-600">
                        {formatCurrency(product.price * product.quantity)}
                    </p>
                </div>

                <button
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                    onClick={() => removeFromCart(product.id)}
                >
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    )
}