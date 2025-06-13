import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import { useState } from "react"

export default function ProductsStep({ orderData, setOrderData }) {
    const [newProduct, setNewProduct] = useState({
        id: "",
        name: "",
        price: 0,
        quantity: 1,
        discount: 0,
        unit: "cái",
    })

    const addProduct = () => {
        if (newProduct.id && newProduct.name && newProduct.price > 0) {
            setOrderData((prev) => ({
                ...prev,
                products: [...prev.products, { ...newProduct, id: Date.now().toString() }],
            }))
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

    const removeProduct = (index) => {
        setOrderData((prev) => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index),
        }))
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sản phẩm</h3>

            {/* Add Product Form */}
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
                        <div className="space-y-2">
                            <Label>Tên sản phẩm</Label>
                            <Input
                                value={newProduct.name}
                                onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Tên sản phẩm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Giá</Label>
                            <Input
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
                                placeholder="Giá"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Số lượng</Label>
                            <Input
                                type="number"
                                value={newProduct.quantity}
                                onChange={(e) => setNewProduct((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                                placeholder="Số lượng"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Giảm giá (%)</Label>
                            <Input
                                type="number"
                                value={newProduct.discount}
                                onChange={(e) => setNewProduct((prev) => ({ ...prev, discount: Number(e.target.value) }))}
                                placeholder="Giảm giá"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>&nbsp;</Label>
                            <Button onClick={addProduct} className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Products List */}
            {orderData.products.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Danh sách sản phẩm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã SP</TableHead>
                                    <TableHead>Tên sản phẩm</TableHead>
                                    <TableHead>Giá</TableHead>
                                    <TableHead>Số lượng</TableHead>
                                    <TableHead>Giảm giá</TableHead>
                                    <TableHead>Thành tiền</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderData.products.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.price.toLocaleString()}đ</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>{product.discount}%</TableCell>
                                        <TableCell>
                                            {(product.price * product.quantity * (1 - product.discount / 100)).toLocaleString()}đ
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="destructive" size="sm" onClick={() => removeProduct(index)}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}