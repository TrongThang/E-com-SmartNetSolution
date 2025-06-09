"use client"

import { Trash2 } from "lucide-react"
import PropTypes from 'prop-types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableCell, TableRow } from "@/components/ui/table"

export function ProductItem({
    product,
    onUpdateProduct,
    onRemoveProduct,
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
            <TableRow className="hover:bg-muted/50">
                <TableCell className="font-medium" >
                    {product.name}
                    <div className="text-xs text-muted-foreground">{product.code}</div>
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
                <TableCell className="">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-white hover:bg-red-500"
                        onClick={(e) => {
                            e.stopPropagation()
                            onRemoveProduct(product.id)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
            </TableRow>
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
    }).isRequired,
    onToggleExpand: PropTypes.func.isRequired,
    onUpdateProduct: PropTypes.func.isRequired,
    onRemoveProduct: PropTypes.func.isRequired,
}

// Default props if needed
ProductItem.defaultProps = {
    isExpanded: false,
    is_gift: false
}