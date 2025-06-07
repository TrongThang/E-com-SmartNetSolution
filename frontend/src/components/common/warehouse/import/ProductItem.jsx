"use client"

import { ChevronDown, ChevronRight, Trash2 } from "lucide-react"
import PropTypes from 'prop-types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { TableCell, TableRow } from "@/components/ui/table"
import { ProductDetails } from "@/components/common/warehouse/import/ProductDetail"

export function ProductItem({
    product,
    isExpanded,
    onToggleExpand,
    onUpdateProduct,
    onRemoveProduct,
    onUpdateSerialNumbers,
    onUpdateBarcode,
}) {
    // Handle quantity change
    const handleQuantityChange = (value) => {
        const quantity = Number.parseInt(value)
        if (!isNaN(quantity) && quantity > 0) {
            onUpdateProduct(product.id, "quantity", quantity)
        }
    }

    return (
        <>
            <TableRow className="cursor-pointer hover:bg-muted/50">
                <TableCell className="w-[30px] p-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onToggleExpand}
                    >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </TableCell>
                <TableCell className="font-medium" onClick={onToggleExpand}>
                    {product.production_batch_id}
                </TableCell>
                <TableCell className="font-medium" onClick={onToggleExpand}>
                    <img src={product.product_image} alt={product.product_name} className="w-10 h-10 rounded-md" />
                </TableCell>
                <TableCell className="font-medium" onClick={onToggleExpand}>
                    {product.product_name}
                    <div className="text-xs text-muted-foreground">{product.product_code}</div>
                </TableCell>
                <TableCell className="w-[100px] text-right">
                    <Input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        className="w-20 text-right"
                        onClick={(e) => e.stopPropagation()}
                    />
                </TableCell>
                <TableCell className="w-[80px]">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => {
                            e.stopPropagation()
                            onRemoveProduct(product.id)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
            </TableRow>
            {isExpanded && (
                <TableRow>
                    <TableCell colSpan={7} className="p-0">
                        <ProductDetails
                            product={product}
                            onUpdateProduct={onUpdateProduct}
                            onUpdateSerialNumbers={onUpdateSerialNumbers}
                            onUpdateBarcode={onUpdateBarcode}
                        />
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}

// PropTypes definition
ProductItem.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        import_price: PropTypes.number.isRequired,
        amount: PropTypes.number,
        is_gift: PropTypes.bool.isRequired
    }).isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onToggleExpand: PropTypes.func.isRequired,
    onUpdateProduct: PropTypes.func.isRequired,
    onRemoveProduct: PropTypes.func.isRequired,
    onUpdateSerialNumbers: PropTypes.func.isRequired,
    onUpdateBarcode: PropTypes.func.isRequired
}

// Default props if needed
ProductItem.defaultProps = {
    isExpanded: false,
    is_gift: false
}