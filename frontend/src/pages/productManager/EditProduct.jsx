"use client"

import { useState, useEffect } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ArrowLeft, Eye, Plus, Upload, X, Star, Edit, ArrowRight } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import productApi from "@/apis/modules/product.api.ts"

export default function ProductDetailPage() {
    const navigate = useNavigate()
    const params = useParams();
    const [loading, setLoading] = useState(false)
    const [errer, setError] = useState(null)
    const [product, setProduct] = useState({
        id: 0,
        name: "",
        slug: "",
        description: "",
        description_normal: "",
        selling_price: 0,
        sold: 0,
        views: 0,
        status: 1,
        is_hide: 0,
        category_id: 0,
        categories: "",
        unit_id: 0,
        unit_name: "",
        stock: "0",
        average_rating: "0",
        total_liked: "0",
        total_review: "0",
        image: "",
        specifications: [],
        images: [],
    })

    // State cho popup thêm thuộc tính
    const [showAddAttributeDialog, setShowAddAttributeDialog] = useState(false)
    const [showAddValueDialog, setShowAddValueDialog] = useState(false)
    const [searchAttribute, setSearchAttribute] = useState("")
    const [selectedAttribute, setSelectedAttribute] = useState(null)
    const [attributeValue, setAttributeValue] = useState("")
    const [selectedSpecGroup, setSelectedSpecGroup] = useState(null)

    // Thêm vào phần state declarations
    const [showEditValueDialog, setShowEditValueDialog] = useState(false)
    const [editingAttribute, setEditingAttribute] = useState(null)
    const [editingGroupIndex, setEditingGroupIndex] = useState(null)
    const [editingAttrIndex, setEditingAttrIndex] = useState(null)
    const [editAttributeValue, setEditAttributeValue] = useState("")

    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [imageStartIndex, setImageStartIndex] = useState(0)

    // Danh sách thuộc tính mẫu
    const availableAttributes = [
        { id: 1, name: "Thông số kỹ thuật", type: "group" },
        { id: 2, name: "Trọng lượng", type: "attribute", parent: 1 },
        { id: 3, name: "Điện năng", type: "attribute", parent: 1 },
        { id: 4, name: "Kích thước", type: "attribute", parent: 1 },
        { id: 5, name: "Độ phân giải", type: "attribute", parent: 1 },
        { id: 6, name: "Tầm nhìn", type: "attribute", parent: 1 },
        { id: 7, name: "Tính năng", type: "group" },
        { id: 8, name: "Chống nước", type: "attribute", parent: 7 },
        { id: 9, name: "Hồng ngoại", type: "attribute", parent: 7 },
        { id: 10, name: "Phát hiện chuyển động", type: "attribute", parent: 7 },
    ]

    // Lọc thuộc tính theo từ khóa tìm kiếm
    const filteredAttributes = availableAttributes.filter((attr) =>
        attr.name.toLowerCase().includes(searchAttribute.toLowerCase()),
    )

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await productApi.getById(params.id);
            if (res.status_code === 200) {
                const data = res.data.data[0] || res.data.data || {}; // Xử lý cả mảng và object
                setProduct({
                    ...product,
                    ...data,
                    stock: Number(data.stock) || 0, // Chuyển stock thành số
                    average_rating: Number(data.average_rating) || 0,
                    total_liked: Number(data.total_liked) || 0,
                    total_review: Number(data.total_review) || 0,
                    specifications: data.specifications || [],
                });
            } else {
                setError("Không thể tải sản phẩm");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải sản phẩm");
            console.error("Failed to fetch product", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) fetchData(); // Chỉ fetch khi có params.id
    }, [params.id]);


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setProduct({
            ...product,
            [name]: value,
        })
    }

    const handleNumberInputChange = (e) => {
        const { name, value } = e.target
        setProduct({
            ...product,
            [name]: value === "" ? 0 : Number(value),
        })
    }

    const handleMultipleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [];
            let processedCount = 0;

            files.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = () => {
                    // Thêm ảnh mới dưới dạng đối tượng { image: "..." }
                    newImages[index] = { image: reader.result };
                    processedCount++;

                    if (processedCount === files.length) {
                        const updatedImages = [...product.images, ...newImages];
                        setProduct({
                            ...product,
                            images: updatedImages,
                            // Nếu chưa có ảnh chính, lấy ảnh đầu tiên từ danh sách mới
                            image: updatedImages.length > 0 ? updatedImages[0].image : product.image,
                        });
                        // Đặt lại selectedImageIndex về 0 nếu cần
                        setSelectedImageIndex(0);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSelectImage = (index) => {
        setSelectedImageIndex(index);
        const selectedImage = product.images[index];
        const imageToShow = selectedImage?.image || "/placeholder.svg"; // Lấy image từ đối tượng
        setProduct({
            ...product,
            image: imageToShow, // Cập nhật ảnh chính
        });
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...product.images];
        updatedImages.splice(index, 1);

        // Cập nhật lại startIndex nếu cần
        if (imageStartIndex > 0 && imageStartIndex >= updatedImages.length - 3) {
            setImageStartIndex(Math.max(0, updatedImages.length - 4));
        }

        // Cập nhật selectedImageIndex và ảnh chính
        let newSelectedIndex = selectedImageIndex;
        let newMainImage = product.image;

        if (updatedImages.length === 0) {
            newSelectedIndex = 0;
            newMainImage = ""; // Nếu không còn ảnh, đặt ảnh chính thành rỗng
        } else if (selectedImageIndex === index) {
            newSelectedIndex = 0; // Nếu xóa ảnh đang chọn, chọn lại ảnh đầu tiên
            newMainImage = updatedImages[0]?.image || "/placeholder.svg";
        } else if (selectedImageIndex > index) {
            newSelectedIndex = selectedImageIndex - 1; // Điều chỉnh index nếu ảnh trước ảnh chọn bị xóa
            newMainImage = updatedImages[newSelectedIndex]?.image || "/placeholder.svg";
        }

        setSelectedImageIndex(newSelectedIndex);
        setProduct({
            ...product,
            images: updatedImages,
            image: newMainImage,
        });
    };

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
        // Tìm nhóm thông số kỹ thuật tương ứng
        const group = availableAttributes.find((g) => g.id === attribute.parent)
        setSelectedSpecGroup(group)
        setShowAddAttributeDialog(false)
        setShowAddValueDialog(true)
    }

    const handleAddAttributeValue = () => {
        if (selectedAttribute && attributeValue && selectedSpecGroup) {
            // Kiểm tra xem nhóm thông số đã tồn tại chưa
            const existingGroupIndex = product.specifications.findIndex((spec) => spec.name === selectedSpecGroup.name)

            if (existingGroupIndex >= 0) {
                // Nhóm đã tồn tại, thêm thuộc tính mới vào nhóm
                const updatedSpecs = [...product.specifications]
                updatedSpecs[existingGroupIndex].attributes.push({
                    id: Date.now(), // Tạo ID tạm thời
                    name: selectedAttribute.name,
                    value: attributeValue,
                })
                setProduct({
                    ...product,
                    specifications: updatedSpecs,
                })
            } else {
                // Nhóm chưa tồn tại, tạo nhóm mới với thuộc tính
                const newSpec = {
                    id: Date.now(), // Tạo ID tạm thời
                    name: selectedSpecGroup.name,
                    attributes: [
                        {
                            id: Date.now() + 1, // Tạo ID tạm thời
                            name: selectedAttribute.name,
                            value: attributeValue,
                        },
                    ],
                }
                setProduct({
                    ...product,
                    specifications: [...product.specifications, newSpec],
                })
            }

            setShowAddValueDialog(false)
            setSelectedAttribute(null)
            setSelectedSpecGroup(null)
            setAttributeValue("")
        }
    }

    // Thêm function này sau handleRemoveAttribute
    const handleEditAttribute = (groupIndex, attrIndex) => {
        const attribute = product.specifications[groupIndex].attributes[attrIndex]
        setEditingAttribute(attribute)
        setEditingGroupIndex(groupIndex)
        setEditingAttrIndex(attrIndex)
        setEditAttributeValue(attribute.value)
        setShowEditValueDialog(true)
    }

    const handleUpdateAttributeValue = () => {
        if (editingGroupIndex !== null && editingAttrIndex !== null && editAttributeValue) {
            const updatedSpecs = [...product.specifications]
            updatedSpecs[editingGroupIndex].attributes[editingAttrIndex].value = editAttributeValue

            setProduct({
                ...product,
                specifications: updatedSpecs,
            })

            setShowEditValueDialog(false)
            setEditingAttribute(null)
            setEditingGroupIndex(null)
            setEditingAttrIndex(null)
            setEditAttributeValue("")
        }
    }

    const handleRemoveAttribute = (groupIndex, attrIndex) => {
        const updatedSpecs = [...product.specifications]
        updatedSpecs[groupIndex].attributes.splice(attrIndex, 1)

        // Nếu nhóm không còn thuộc tính nào, xóa luôn nhóm
        if (updatedSpecs[groupIndex].attributes.length === 0) {
            updatedSpecs.splice(groupIndex, 1)
        }

        setProduct({
            ...product,
            specifications: updatedSpecs,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Xử lý lưu sản phẩm
        console.log("Lưu sản phẩm:", product)
        // Chuyển hướng về trang danh sách sản phẩm
        navigate("/admin/products")
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                    <Link href="/dashboard/products">
                        <ArrowLeft className="h-4 w-4" />
                        Trở về
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white">
                    <TabsTrigger value="info" className="data-[state=active]:bg-black data-[state=active]:text-white">Thông tin sản phẩm</TabsTrigger>
                    <TabsTrigger value="specs" className="data-[state=active]:bg-black data-[state=active]:text-white">Thông số kỹ thuật</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 pt-4">
                    <div className="rounded-lg bg-muted/30 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Thông tin chi tiết sản phẩm */}
                                <div className="space-y-6">
                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="name">Tên sản phẩm:</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={product.name}
                                            onChange={handleInputChange}
                                            className="bg-muted"
                                        />
                                    </div>

                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="slug">Slug:</Label>
                                        <Input
                                            id="slug"
                                            name="slug"
                                            value={product.slug}
                                            onChange={handleInputChange}
                                            className="bg-muted"
                                        />
                                    </div>

                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="description">Mô tả ngắn:</Label>
                                        <Input
                                            id="description"
                                            name="description"
                                            value={product.description}
                                            onChange={handleInputChange}
                                            className="bg-muted"
                                        />
                                    </div>

                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="description_normal">Mô tả chi tiết:</Label>
                                        <Textarea
                                            id="description_normal"
                                            name="description_normal"
                                            value={product.description_normal}
                                            onChange={handleInputChange}
                                            className="bg-muted"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="selling_price">Giá bán:</Label>
                                            <Input
                                                id="selling_price"
                                                name="selling_price"
                                                type="number"
                                                value={product.selling_price}
                                                onChange={handleNumberInputChange}
                                                className="bg-muted"
                                            />
                                        </div>

                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="stock">Tồn kho:</Label>
                                            <Input
                                                id="stock"
                                                name="stock"
                                                type="number"
                                                value={product.stock}
                                                onChange={handleInputChange}
                                                className="bg-muted"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="categories">Danh mục:</Label>
                                            <Input
                                                id="categories"
                                                name="categories"
                                                value={product.categories}
                                                onChange={handleInputChange}
                                                className="bg-muted"
                                            />
                                        </div>

                                        <div className="grid w-full items-center gap-2">
                                            <Label htmlFor="unit_name">Đơn vị:</Label>
                                            <Input
                                                id="unit_name"
                                                name="unit_name"
                                                value={product.unit_name}
                                                onChange={handleInputChange}
                                                className="bg-muted"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_hide"
                                                checked={product.is_hide === 1}
                                                onCheckedChange={(checked) => setProduct({ ...product, is_hide: checked ? 1 : 0 })}
                                            />
                                            <Label htmlFor="is_hide">Ẩn sản phẩm</Label>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="status">Trạng thái:</Label>
                                            <Select
                                                value={product.status.toString()}
                                                onValueChange={(value) => setProduct({ ...product, status: Number.parseInt(value) })}
                                            >
                                                <SelectTrigger id="status" className="bg-muted w-[150px]">
                                                    <SelectValue placeholder="Chọn trạng thái" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Hoạt động</SelectItem>
                                                    <SelectItem value="0">Ngừng kinh doanh</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Hình ảnh và thông tin bổ sung */}
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center">
                                        <Label className="mb-2">Hình ảnh sản phẩm:</Label>

                                        {/* Hình ảnh chính - Hiển thị ảnh theo selectedImageIndex hoặc ảnh đầu tiên */}
                                        <div
                                            className="relative flex h-[200px] w-[200px] cursor-pointer flex-col items-center justify-center rounded-md border bg-muted mb-4"
                                            onClick={() => document.getElementById("image-upload").click()}
                                        >
                                            {(product?.images?.length > 0) ? (
                                                <img
                                                    src={product.images[selectedImageIndex]?.image || product.images[0].image}
                                                    alt={product.name || "Hình ảnh sản phẩm"}
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
                                                multiple
                                                onChange={handleMultipleImageUpload}
                                                className="hidden"
                                            />
                                        </div>

                                        {/* Hiển thị ảnh nhỏ với điều hướng */}
                                        <div className="flex items-center w-[300px] mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setImageStartIndex(Math.max(0, imageStartIndex - 1))}
                                                disabled={imageStartIndex === 0}
                                                className="h-8 w-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 disabled:opacity-30 mr-2"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                            </button>

                                            <div className="grid grid-cols-4 gap-3 flex-1">
                                                {(product?.images || []).slice(imageStartIndex, imageStartIndex + 4).map((imageObj, index) => (
                                                    <div
                                                        key={imageStartIndex + index}
                                                        className={`relative h-14 w-14 cursor-pointer rounded-md border-2 ${selectedImageIndex === imageStartIndex + index ? "border-primary" : "border-muted"
                                                            } bg-muted overflow-hidden`}
                                                        onClick={() => handleSelectImage(imageStartIndex + index)}
                                                    >
                                                        <img
                                                            src={imageObj?.image || "/placeholder.svg"}
                                                            alt={`Ảnh ${imageStartIndex + index + 1}`}
                                                            className="h-full w-full rounded-md object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveImage(imageStartIndex + index);
                                                            }}
                                                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 shadow-sm"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                {Array.from({
                                                    length: Math.max(0, 4 - (product?.images || []).slice(imageStartIndex, imageStartIndex + 4).length),
                                                }).map((_, index) => (
                                                    <div
                                                        key={`empty-${index}`}
                                                        className="h-14 w-14 rounded-md border-2 border-dashed border-muted bg-muted/30 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                                                        onClick={() => document.getElementById("image-upload").click()}
                                                    >
                                                        <Plus className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setImageStartIndex(Math.min((product?.images?.length || 0) - 1, imageStartIndex + 1))}
                                                disabled={imageStartIndex + 4 >= (product?.images?.length || 0)}
                                                className="h-8 w-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 disabled:opacity-30 ml-2"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-4 rounded-md border p-4">
                                        <h3 className="font-medium">Thông tin bổ sung</h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Đã bán</span>
                                                <span className="font-medium">{product.sold || 0}</span>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Lượt xem</span>
                                                <span className="font-medium">{product.views || 0}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Đánh giá</span>
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-1">{product.average_rating || 0}</span>
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="ml-1 text-xs text-muted-foreground">({product.total_review || 0} đánh giá)</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Lượt thích</span>
                                                <span className="font-medium">{product.total_liked || 0}</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Ngày tạo</span>
                                                <span className="font-medium">{product.created_at ? new Date(product.created_at).toLocaleDateString("vi-VN") : "N/A"}</span>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted-foreground">Cập nhật lần cuối</span>
                                                <span className="font-medium">{product.updated_at ? new Date(product.updated_at).toLocaleDateString("vi-VN") : "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
                                    Hủy
                                </Button>
                                <Button type="submit" className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-1">Lưu</Button>
                            </div>
                        </form>
                    </div>
                </TabsContent>

                <TabsContent value="specs" className="space-y-4 pt-4">
                    <div className="rounded-lg bg-muted/30 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Thông số kỹ thuật</h2>
                            <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowAddAttributeDialog(true)}>
                                <Plus className="h-4 w-4" />
                                Thêm thuộc tính
                            </Button>
                        </div>

                        {product.specifications.length > 0 ? (
                            <div className="space-y-6">
                                {product.specifications.map((specGroup, groupIndex) => (
                                    <Card key={specGroup.id} className="p-4">
                                        <h3 className="mb-4 font-medium">{specGroup.name}</h3>
                                        <div className="space-y-3">
                                            {specGroup.attributes.map((attr, attrIndex) => (
                                                <div key={attr.id} className="flex items-start group">
                                                    <div className="w-1/3 font-medium">{attr.name}:</div>
                                                    <div className="flex w-2/3 items-center justify-between">
                                                        <span>{attr.value}</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEditAttribute(groupIndex, attrIndex)}
                                                                className="invisible rounded-full p-1 text-blue-500 hover:bg-blue-50 group-hover:visible"
                                                                title="Sửa"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveAttribute(groupIndex, attrIndex)}
                                                                className="invisible rounded-full p-1 text-red-500 hover:bg-red-50 group-hover:visible"
                                                                title="Xóa"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                Chưa có thông số kỹ thuật nào. Nhấn "Thêm thuộc tính" để bắt đầu.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Dialog thêm thuộc tính */}
            <Dialog open={showAddAttributeDialog} onOpenChange={setShowAddAttributeDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Thêm thuộc tính sản phẩm</DialogTitle>
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
                        <DialogTitle className="text-xl">Thêm giá trị thuộc tính</DialogTitle>
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
                        <Button variant="outline" onClick={() => setShowAddValueDialog(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleAddAttributeValue}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog sửa giá trị thuộc tính */}
            <Dialog open={showEditValueDialog} onOpenChange={setShowEditValueDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Sửa giá trị thuộc tính</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                            <Label htmlFor="editAttributeValue" className="w-1/3 text-right">
                                {editingAttribute?.name}:
                            </Label>
                            <Input
                                id="editAttributeValue"
                                value={editAttributeValue}
                                onChange={(e) => setEditAttributeValue(e.target.value)}
                                className="w-2/3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditValueDialog(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleUpdateAttributeValue} className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-1">Cập nhật</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
