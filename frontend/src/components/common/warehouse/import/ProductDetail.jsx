"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
// import { BarcodeInput } from "@/components/common/warehouse/import/BarcodeInput"
import { SerialNumberInput } from "@/components/common/warehouse/import/SerialNumberInput"

export function ProductDetails({
    product,
    onUpdateProduct,
    onUpdateSerialNumbers,
    onUpdateBarcode,
}) {
    return (
        <div className="bg-muted/30 p-4 border-t border-b">
            {/* Barcode section */}
            <div className="space-y-4 mb-4">
                <h4 className="font-medium">Mã vạch (Barcode)</h4>
                {/* <BarcodeInput
                    barcode={product.barcode || ""}
                    onBarcodeChange={(barcode) => onUpdateBarcode(product.id, barcode)}
                /> */}
            </div>

            {/* Serial numbers section */}
            <div className="space-y-4 mb-4">
                <SerialNumberInput
                    productId={product.id}
                    serialNumbers={product.serial_numbers || []}
                    quantity={product.quantity}
                    onSerialNumbersChange={(serialNumbers) => onUpdateSerialNumbers(product.id, serialNumbers)}
                />
            </div>
            

            <div className="mt-4">
                <Label htmlFor={`note-${product.id}`}>Ghi chú</Label>
                <Input
                    id={`note-${product.id}`}
                    placeholder="Ghi chú cho sản phẩm này"
                    value={product.note || ""}
                    onChange={(e) => onUpdateProduct(product.id, "note", e.target.value)}
                    className="mt-1"
                />
            </div>
        </div>
    )
}   