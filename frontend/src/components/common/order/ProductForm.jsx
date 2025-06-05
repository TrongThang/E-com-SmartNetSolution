// components/ui/ProductForm.jsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

export function ProductForm({ onAddProduct }) {
    const [newProduct, setNewProduct] = useState({
        id: "",
        name: "",
        price: 0,
        quantity: 1,
        discount: 0,
        unit: "cái",
    })

    const handleAdd = () => {
        if (newProduct.id && newProduct.name && newProduct.price > 0) {
            onAddProduct({ ...newProduct, id: Date.now().toString() })
            setNewProduct({
                id: "",
                name: "",
                price: 0,
                quantity: 1,
                discount: 0,
                unit: "cái",
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Thêm sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="space-y-2">
                        <Label>Mã SP</Label>
                        <Input
                            value={newProduct.id}
                            onChange={(e) => setNewProduct((prev) => ({ ...prev, id: e.target.value }))}
                            placeholder="Mã sản phẩm"
                        />
                    </div>
                    {/* ... Các trường khác tương tự ... */}
                    <div className="space-y-2">
                        <Label>&nbsp;</Label>
                        <Button onClick={handleAdd} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}