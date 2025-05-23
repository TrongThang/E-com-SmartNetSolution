"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ArrowLeft, Eye, Plus, Upload, X } from "lucide-react"
import { Label } from "@/components/ui/label"

const AddProductPage = () => {
    const navigate = useNavigate()
    const [product, setProduct] = useState({
        name: "",
        slug: "",
        price: "",
        description: "",
        image: null,
        hidden: false,
        status: "1",
        fullDescription: "",
        specifications: [
            { name: "Trọng lượng", value: "1.5 kg" },
            { name: "Công suất", value: "220W" },
            { name: "Tích hợp AI", value: "" },
        ],
    })

    // State cho popup thêm thuộc tính
    const [showAddAttributeDialog, setShowAddAttributeDialog] = useState(false)
    const [showAddValueDialog, setShowAddValueDialog] = useState(false)
    const [searchAttribute, setSearchAttribute] = useState("")
    const [selectedAttribute, setSelectedAttribute] = useState(null)
    const [attributeValue, setAttributeValue] = useState("")

    // Danh sách thuộc tính mẫu
    const availableAttributes = [
        { id: 1, name: "Thông số kỹ thuật", type: "group" },
        { id: 2, name: "Trọng lượng", type: "attribute", parent: 1 },
        { id: 3, name: "Công suất", type: "attribute", parent: 1 },
        { id: 4, name: "Tính năng thông minh", type: "group", parent: 1 },
        { id: 5, name: "Tích hợp AI", type: "attribute", parent: 1 },
        { id: 6, name: "Kích thước", type: "attribute", parent: 1 },
        { id: 7, name: "Màu sắc", type: "group" },
        { id: 8, name: "Đen", type: "attribute", parent: 7 },
        { id: 9, name: "Trắng", type: "attribute", parent: 7 },
        { id: 10, name: "Bạc", type: "attribute", parent: 7 },
    ]

    // Lọc thuộc tính theo từ khóa tìm kiếm
    const filteredAttributes = availableAttributes.filter((attr) =>
        attr.name.toLowerCase().includes(searchAttribute.toLowerCase()),
    )

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setProduct({ ...product, image: reader.result })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSelectAttribute = (attribute) => {
        setSelectedAttribute(attribute)
        setShowAddAttributeDialog(false)
        setShowAddValueDialog(true)
    }

    const handleAddAttributeValue = () => {
        if (selectedAttribute && attributeValue) {
            const newSpec = { name: selectedAttribute.name, value: attributeValue }
            setProduct({
                ...product,
                specifications: [...product.specifications, newSpec],
            })
            setShowAddValueDialog(false)
            setSelectedAttribute(null)
            setAttributeValue("")
        }
    }

    const handleRemoveSpecification = (index) => {
        const newSpecs = [...product.specifications]
        newSpecs.splice(index, 1)
        setProduct({ ...product, specifications: newSpecs })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Xử lý lưu sản phẩm
        console.log("Lưu sản phẩm:", product)
        // Chuyển hướng về trang danh sách sản phẩm
        navigate("/admin/products")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                    <Link to="/admin/products">
                        <ArrowLeft className="h-4 w-4" />
                        Trở về
                    </Link>
                </Button>
            </div>

            <form onSubmit={() => handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Thông tin chi tiết thiết bị */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Thêm sản phẩm</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Tên thiết bị:</Label>
                                <Input
                                    id="name"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                    className="bg-muted"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug:</Label>
                                <Input
                                    id="slug"
                                    value={product.slug}
                                    onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                                    className="bg-muted"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Giá bán:</Label>
                                <Input
                                    id="price"
                                    value={product.price}
                                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                    className="bg-muted max-w-[250px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả thường:</Label>
                                <Textarea
                                    id="description"
                                    value={product.description}
                                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                    className="bg-muted"
                                    rows={3}
                                />
                            </div>

                            {/* <div className="space-y-2">
                                <Label htmlFor="warranty">Thời gian bảo hành:</Label>
                                <Select value={product.warranty} onValueChange={(value) => setProduct({ ...product, warranty: value })}>
                                    <SelectTrigger id="warranty" className="bg-muted w-[250px]">
                                        <SelectValue placeholder="Chọn thời gian bảo hành" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="6 tháng">6 tháng</SelectItem>
                                        <SelectItem value="12 tháng">12 tháng</SelectItem>
                                        <SelectItem value="24 tháng">24 tháng</SelectItem>
                                        <SelectItem value="36 tháng">36 tháng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div> */}

                            <div className="space-y-2">
                                <Label htmlFor="image">Ảnh thiết bị:</Label>
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className="relative flex h-[150px] w-[200px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-muted"
                                        onClick={() => document.getElementById("image-upload").click()}
                                    >
                                        {product.image ? (
                                            <img
                                                src={product.image || "/placeholder.svg"}
                                                alt="Product"
                                                className="h-full w-full rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Upload className="mb-2 h-10 w-10" />
                                                <span className="text-xs">Upload ảnh</span>
                                            </div>
                                        )}
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="hidden"
                                        checked={product.hidden}
                                        onCheckedChange={(checked) => setProduct({ ...product, hidden: checked })}
                                    />
                                    <Label htmlFor="hidden">Ẩn:</Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Label htmlFor="status">Trạng thái:</Label>
                                    <Select value={product.status} onValueChange={(value) => setProduct({ ...product, status: value })}>
                                        <SelectTrigger id="status" className="bg-muted w-[150px]">
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Hoạt động</SelectItem>
                                            <SelectItem value="-1">Ngừng bán</SelectItem>
                                            <SelectItem value="0">Hết hàng</SelectItem>
                                            <SelectItem value="2">Giảm giá</SelectItem>
                                            <SelectItem value="3">Nổi bật</SelectItem>
                                            <SelectItem value="4">Sản phẩm mới</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fullDescription">Mô tả:</Label>
                                <Textarea
                                    id="fullDescription"
                                    value={product.fullDescription}
                                    onChange={(e) => setProduct({ ...product, fullDescription: e.target.value })}
                                    className="bg-muted"
                                    rows={6}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Thuộc tính thiết bị */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Thuộc tính thiết bị</h2>
                            <Button type="button" variant="outline" size="sm" className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-1" onClick={() => setShowAddAttributeDialog(true)}>
                                <Plus className="h-4 w-4" />
                                Thêm thuộc tính
                            </Button>
                        </div>

                        <Card className="p-6">
                            <h2 className="mb-4 font-medium text-lg">Thông số kỹ thuật</h2>
                            <div className="space-y-3">
                                {product.specifications.map((spec, index) => (
                                    <div key={index} className="flex items-start group">
                                        {spec.value && (
                                        <div className="w-1/3 font-medium">{spec.name}:</div>
                                        )}
                                        {!spec.value && (
                                        <div className="w-1/3 font-medium">{spec.name}</div>
                                        )}
                                        <div className="flex w-2/3 items-center justify-between">
                                            <span>{spec.value}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSpecification(index)}
                                                className="invisible rounded-full p-1 text-red-500 hover:bg-red-50 group-hover:visible"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" type="button" onClick={() => navigate("/admin/products")}>
                        Hủy
                    </Button>
                    <Button type="submit" className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-1">Lưu</Button>
                </div>
            </form>

            {/* Dialog thêm thuộc tính */}
            <Dialog open={showAddAttributeDialog} onOpenChange={setShowAddAttributeDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Thêm thuộc tính thiết bị</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input
                            placeholder="Tìm kiếm"
                            value={searchAttribute}
                            onChange={(e) => setSearchAttribute(e.target.value)}
                            className="mb-4"
                        />

                        <div className="max-h-[300px] space-y-2 overflow-y-auto">
                            {filteredAttributes
                                .filter((attr) => attr.type === "group")
                                .map((group) => (
                                    <div key={group.id} className="space-y-2">
                                        <div className="font-medium">{group.name}</div>
                                        <div className="space-y-2 pl-4">
                                            {filteredAttributes
                                                .filter((attr) => attr.parent === group.id)
                                                .map((attr) => (
                                                    <div
                                                        key={attr.id}
                                                        className="flex cursor-pointer items-center justify-between rounded-md border p-2 hover:bg-muted"
                                                        onClick={() => handleSelectAttribute(attr)}
                                                    >
                                                        <span>{attr.name}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog thêm giá trị thuộc tính */}
            <Dialog open={showAddValueDialog} onOpenChange={setShowAddValueDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Thêm giá trị thuộc tính thiết bị</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                            <Label htmlFor="attributeValue" className="w-1/3 text-right">
                                {selectedAttribute?.name}:
                            </Label>
                            <Input
                                id="attributeValue"
                                value={attributeValue}
                                onChange={(e) => setAttributeValue(e.target.value)}
                                className="w-2/3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {setShowAddValueDialog(false); setShowAddAttributeDialog(true)}}>
                            Hủy
                        </Button>
                        <Button variant="outline" className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-1" onClick={handleAddAttributeValue}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddProductPage;