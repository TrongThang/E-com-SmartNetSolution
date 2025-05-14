"use client"

import { useState } from "react"
import { Search, Plus, Barcode, Scan } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
        requires_serial: true,
        barcode: "8938505420427",
    },
    {
        id: 2,
        name: "Màn hình Dell 27 inch",
        code: "PROD002",
        category: "Màn hình",
        price: 5000000,
        image: "/placeholder.svg?height=80&width=80",
        requires_serial: true,
        barcode: "8938505420434",
    },
    {
        id: 3,
        name: "Bàn phím cơ Logitech",
        code: "PROD003",
        category: "Bàn phím",
        price: 2000000,
        image: "/placeholder.svg?height=80&width=80",
        requires_serial: false,
        barcode: "8938505420441",
    },
    {
        id: 4,
        name: "Chuột không dây Logitech",
        code: "PROD004",
        category: "Chuột",
        price: 500000,
        image: "/placeholder.svg?height=80&width=80",
        requires_serial: false,
        barcode: "8938505420458",
    },
    {
        id: 5,
        name: "Tai nghe Bluetooth Sony",
        code: "PROD005",
        category: "Tai nghe",
        price: 3000000,
        image: "/placeholder.svg?height=80&width=80",
        requires_serial: true,
        barcode: "8938505420465",
    },
]

export function ProductSelector({ open, onOpenChange, onProductSelect }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [barcodeInput, setBarcodeInput] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const [isScanning, setIsScanning] = useState(false)

    // Filter products based on search term and category
    const filteredProducts = sampleProducts.filter(
        (product) =>
            (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.barcode.includes(searchTerm)) &&
            (activeTab === "all" || product.category.toLowerCase() === activeTab.toLowerCase()),
    )

    // Find product by barcode
    const findProductByBarcode = (barcode) => {
        return sampleProducts.find((product) => product.barcode === barcode)
    }

    // Handle product search by barcode
    const handleProductSearchByBarcode = () => {
        if (!barcodeInput.trim()) return

        const product = findProductByBarcode(barcodeInput)
        if (product) {
            onProductSelect(product)
            setBarcodeInput("")
            onOpenChange(false)
        } else {
            alert("Không tìm thấy sản phẩm với mã vạch này!")
        }
    }

    // Handle scan result
    const handleScanResult = (result) => {
        const product = findProductByBarcode(result)
        if (product) {
            onProductSelect(product)
            setIsScanning(false)
            onOpenChange(false)
        } else {
            alert("Không tìm thấy sản phẩm với mã vạch này!")
        }
    }

    // Get unique categories
    const categories = ["all", ...new Set(sampleProducts.map((product) => product.category.toLowerCase()))]

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

                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Nhập mã vạch"
                                    value={barcodeInput}
                                    onChange={(e) => setBarcodeInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            handleProductSearchByBarcode()
                                        }
                                    }}
                                />
                                <Button onClick={handleProductSearchByBarcode}>
                                    <Barcode className="h-4 w-4 mr-1" />
                                    Tìm
                                </Button>
                                <Button variant="outline" onClick={() => setIsScanning(true)}>
                                    <Scan className="h-4 w-4 mr-1" />
                                    Quét
                                </Button>
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
                                                    <Badge variant="outline">{product.code}</Badge>
                                                    <Badge variant="secondary" className="capitalize">
                                                        {product.category}
                                                    </Badge>
                                                </div>
                                                <p className="mt-1 font-medium">{product.price.toLocaleString()} VNĐ</p>
                                                {product.barcode && (
                                                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                        <Barcode className="h-3 w-3" />
                                                        {product.barcode}
                                                    </div>
                                                )}
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
