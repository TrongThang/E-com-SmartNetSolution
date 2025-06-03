"use client"

import { Link } from "react-router-dom"
import { useCart } from "@/contexts/CartContext"
import { formatCurrency } from "@/utils/format"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Minus, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export default function CartItem({ product }) {
  const { updateQuantity, removeFromCart, toggleSelectItem } = useCart()
  console.log("product", product)
  const handleInputQuantity = (value) => {
    const quantity = Number(value) || 0
    if (quantity > product.stock) {
      alert("Số lượng không hợp lệ")
      return
    }
    updateQuantity(product.id, quantity)
  }

  const isInStock = product.status > 0
  const isLowStock = isInStock && product.stock <= 5
  const isAtMaxQuantity = product.quantity >= product.stock

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
          checked={product.selected}
          onChange={() => toggleSelectItem(product.id)}
          disabled={!isInStock}
        />

        <div className="relative">
          <img
            src={product.image || "/placeholder.svg?height=80&width=80"}
            alt={product.name}
            className={cn("w-20 h-20 object-cover rounded-md border", !isInStock && "opacity-60")}
          />
          {!isInStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
              <Badge variant="destructive" className="absolute top-1 right-1">
                Hết hàng
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <Link
            to={`/products/${product.slug}`}
            className={cn(
              "text-lg font-medium hover:text-primary transition-colors line-clamp-2",
              !isInStock && "text-gray-500",
            )}
          >
            {product.name}
          </Link>

          <div className="flex items-center mt-1 space-x-2">
            {!isInStock ? (
              <Badge variant="destructive">Ngừng bán</Badge>
            ) : isLowStock ? (
              <Badge variant="warning" className="bg-amber-500">
                Còn {product.stock} sản phẩm
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Còn hàng
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-end md:items-center space-y-3 md:space-y-0 md:space-x-6">
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-md overflow-hidden shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none border-r"
              onClick={() => updateQuantity(product.id, product.quantity - 1)}
              disabled={product.quantity <= 1 || !isInStock}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <input
              type="text"
              className="w-12 text-center py-1 focus:outline-none"
              value={product.quantity}
              onChange={(e) => handleInputQuantity(e.target.value)}
              min="1"
              max={product.stock}
              disabled={!isInStock}
            />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none border-l"
              onClick={() => updateQuantity(product.id, product.quantity + 1)}
              disabled={isAtMaxQuantity || !isInStock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="text-right min-w-[120px]">
          <p className="text-muted-foreground">{formatCurrency(product.price)}</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(product.price * product.quantity)}</p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:bg-red-500 hover:text-white w-10 h-10 rounded-full"
          onClick={() => removeFromCart(product.id)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
