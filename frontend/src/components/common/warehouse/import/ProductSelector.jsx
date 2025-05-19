"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Barcode, Scan } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosPublic from "@/apis/clients/public.client"
import { formatCurrency } from "@/utils/format"
// import { BarcodeScanner } from "@/components/common/warehouse/BarcodeScanner"

// Sample data for products
const sampleProducts = [
    {
        id: 1,
        name: "Laptop Dell XPS 13",
        code: "PROD001",
        category: "Laptop",
        price: 25000000,
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: 2,
        name: "Màn hình Dell 27 inch",
        code: "PROD002",
        category: "Màn hình",
        price: 5000000,
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: 3,
        name: "Bàn phím cơ Logitech",
        code: "PROD003",
        category: "Bàn phím",
        price: 2000000,
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: 4,
        name: "Chuột không dây Logitech",
        code: "PROD004",
        category: "Chuột",
        price: 500000,
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: 5,
        name: "Tai nghe Bluetooth Sony",
        code: "PROD005",
        category: "Tai nghe",
        price: 3000000,
        image: "/placeholder.svg?height=80&width=80",
    },
]

export function ProductSelector({ open, onOpenChange, onProductSelect }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const response = await axiosPublic.get('/product')
                console.log("response", response.data.data)
                if (response.status_code === 200) {
                    setProducts(response.data.data)
                } else {
                    setError('Failed to fetch products')
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
    
        if (open) {
            fetchProducts()
        }
    }, [open])

    // Filter products based on search term and category
    const filteredProducts = products.filter(
        (product) =>
            (product.name.toLowerCase().includes(searchTerm.toLowerCase())
                ) &&
            (activeTab === "all" || product.categories.toLowerCase() === activeTab.toLowerCase()),
    )

    // Get unique categories
    const categories = ["all", ...new Set(products.map((product) => product.categories.toLowerCase()))]

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Thêm sản phẩm</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 ">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Tìm kiếm sản phẩm theo tên hoặc mã"
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid grid-cols-4">
                                <TabsTrigger value="all">Tất cả</TabsTrigger>
                                {categories
                                    .filter((cat) => cat !== "all")
                                    .slice(0, 3)
                                    .map((category) => (
                                        <TabsTrigger key={category} value={category} className="capitalize">
                                            {category}
                                        </TabsTrigger>
                                    ))}
                            </TabsList>
                        </Tabs>

                        <ScrollArea className="h-[400px]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredProducts.map((product) => (
                                    <Card
                                        key={product.id}
                                        className="hover:bg-muted transition-colors cursor-pointer"
                                        onClick={() => {
                                            onProductSelect(product)
                                            onOpenChange(false)
                                        }}
                                    >
                                        <CardContent className="flex items-start">
                                            <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                                <img
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium line-clamp-2">{product.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="capitalize">
                                                        {product.categories}
                                                    </Badge>
                                                </div>
                                                <p className="mt-1 font-medium">{formatCurrency(product.selling_price)} VNĐ</p>
                                            </div>
                                            <Button size="sm" className="flex-shrink-0">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>

            {/* <BarcodeScanner
                isOpen={isScanning}
                onClose={() => setIsScanning(false)}
                onScanSuccess={handleScanResult}
                scanType="barcode"
            /> */}
        </>
    )
}
