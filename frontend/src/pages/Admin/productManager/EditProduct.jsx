"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Upload, X, Edit, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import productApi from "@/apis/modules/product.api.ts";
import categoryApi from "@/apis/modules/categories.api.ts";
import WarrantyTimeApi from "@/apis/modules/warrantyTime.api.ts";
import UnitApi from "@/apis/modules/unit.api.ts";
import Swal from "sweetalert2";

const PRODUCT = {
    STOP_SELLING: -1,
    SOLD_OUT: 0, 
    ACTIVE: 1,
    DISCOUNT: 2,
    FETURED: 3,
    NEW: 4,
};

export default function ProductDetailPage() {
    const navigate = useNavigate();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState({
        id: 0,
        name: "",
        slug: "",
        description: "",
        description_normal: "",
        selling_price: 0,
        sold: 0,
        views: 0,
        status: PRODUCT.ACTIVE, // Mặc định là ACTIVE
        is_hide: false,
        category_id: 0,
        unit_id: 0,
        warrenty_time_id: 0,
        image: "",
        images: [],
        attributes: [],
        created_at: "",
        updated_at: "",
    });
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [warrentyTimes, setWarrentyTimes] = useState([]);

    const [showAddAttributeDialog, setShowAddAttributeDialog] = useState(false);
    const [showAddValueDialog, setShowAddValueDialog] = useState(false);
    const [searchAttribute, setSearchAttribute] = useState("");
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const [selectedSpecGroup, setSelectedSpecGroup] = useState(null);
    const [attributeValue, setAttributeValue] = useState("");

    const [showEditValueDialog, setShowEditValueDialog] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState(null);
    const [editingAttrIndex, setEditingAttrIndex] = useState(null);
    const [editAttributeValue, setEditAttributeValue] = useState("");

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageStartIndex, setImageStartIndex] = useState(0);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await productApi.getById(params.id);
            if (res.status_code === 200) {
                const data = res.data.data[0] || res.data.data || {};
                console.log("API Response:", data); // Debug API response

                let warrentyTimeId = Number(data.warrenty_time_id) || 0;
                if (!data.warrenty_time_id && warrentyTimes.length > 0) {
                    warrentyTimeId = warrentyTimes[0].id;
                }

                const attributes = Array.isArray(data.attributes)
                    ? data.attributes.map((attr) => ({
                        id: attr.attribute_id || attr.id,
                        name: attr.attribute_name || attr.name || "Unknown",
                        value: attr.value || "",
                        attribute_type: attr.attribute_type || "text",
                    }))
                    : [];

                setProduct({
                    id: data.id || 0,
                    name: data.name || "",
                    slug: data.slug || "",
                    description: data.description || "",
                    description_normal: data.description_normal || "",
                    selling_price: Number(data.selling_price) || 0,
                    sold: Number(data.sold) || 0,
                    views: Number(data.views) || 0,
                    status: Number(data.status) || PRODUCT.ACTIVE,
                    is_hide: Boolean(data.is_hide),
                    category_id: Number(data.category_id) || 0,
                    unit_id: Number(data.unit_id) || 0,
                    warrenty_time_id: warrentyTimeId,
                    image: data.image || "",
                    images: Array.isArray(data.images) ? data.images.map(img => ({ image: img.image || "/placeholder.svg" })) : [],
                    attributes,
                    created_at: data.created_at || "",
                    updated_at: data.updated_at || "",
                });
                setSelectedImageIndex(0);
            } else {
                setError("Không thể tải sản phẩm");
            }
        } catch (err) {
            setError("Có lỗi khi tải sản phẩm");
            console.error("Failed to fetch product", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await categoryApi.list();
            if (res.status_code === 200 && Array.isArray(res?.data?.categories)) {
                setCategories(res.data.categories || []);
            } else {
                setError("Không thể tải danh mục");
                setCategories([]);
            }
        } catch (err) {
            setError("Error fetching categories");
            console.error("Failed to load categories", err);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnits = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await UnitApi.list();
            if (res.status_code === 200 && Array.isArray(res.data.data)) {
                setUnits(res?.data?.data || res.data);
            } else {
                setError("Không thể tải đơn vị");
                setUnits([]);
            }
        } catch (err) {
            setError("Có lỗi khi tải đơn vị");
            console.error("Failed to load units", err);
            setUnits([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchWarrentyTimes = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await WarrantyTimeApi.list();
            if (res.status_code === 200 && Array.isArray(res.data.data)) {
                setWarrentyTimes(res?.data?.data || res.data);
            } else {
                setError("Không thể tải thời gian bảo hành");
                setWarrentyTimes([]);
            }
        } catch (err) {
            setError("Có lỗi khi tải thời gian bảo hành");
            console.error("Failed to load warrenty times", err);
            setWarrentyTimes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) fetchProducts();
    }, [params.id, warrentyTimes]);

    useEffect(() => {
        fetchCategories();
        fetchUnits();
        fetchWarrentyTimes();
    }, []);

    const renderCategoryOptions = (categories, level = 0) => {
        const options = [];
        categories.forEach((category) => {
            const indent = "—".repeat(level);
            const isRootCategory = level === 0;
            const isLeafCategory = !category.children || category.children.length === 0;

            options.push(
                <SelectItem
                    key={category.category_id}
                    value={category.category_id.toString()}
                    disabled={isRootCategory || !isLeafCategory}
                    className={isRootCategory || !isLeafCategory ? "font-medium text-muted-foreground cursor-not-allowed" : "text-foreground"}
                >
                    <div className="flex items-center gap-2">
                        <span>{indent} {category.name}</span>
                    </div>
                </SelectItem>
            );

            if (category.children && category.children.length > 0) {
                options.push(...renderCategoryOptions(category.children, level + 1));
            }
        });
        return options;
    };

    const handleCategoryChange = (value) => {
        if (product.attributes.length > 0 && product.category_id !== 0) {
            Swal.fire({
                title: "Xác nhận thay đổi danh mục",
                text: "Những thông tin kỹ thuật sẽ mất khi bạn đổi danh mục.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
            }).then((result) => {
                if (result.isConfirmed) {
                    setProduct({
                        ...product,
                        category_id: Number.parseInt(value),
                        attributes: [],
                    });
                }
            });
        } else {
            setProduct({
                ...product,
                category_id: Number.parseInt(value),
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });
    };

    const handleNumberInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value === "" ? 0 : Number(value),
        });
    };

    const handleMultipleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [];
            let processedCount = 0;
            files.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = () => {
                    newImages[index] = { image: reader.result };
                    processedCount++;
                    if (processedCount === files.length) {
                        const updatedImages = [...product.images, ...newImages];
                        setProduct({
                            ...product,
                            images: updatedImages,
                            image: updatedImages.length > 0 ? updatedImages[0].image : product.image,
                        });
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
        const imageToShow = selectedImage?.image || "/placeholder.svg";
        setProduct({
            ...product,
            image: imageToShow,
        });
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...product.images];
        updatedImages.splice(index, 1);
        if (imageStartIndex > 0 && imageStartIndex >= updatedImages.length - 3) {
            setImageStartIndex(Math.max(0, updatedImages.length - 4));
        }
        let newSelectedIndex = selectedImageIndex;
        let newMainImage = product.image;
        if (updatedImages.length === 0) {
            newSelectedIndex = 0;
            newMainImage = "";
        } else if (selectedImageIndex === index) {
            newSelectedIndex = 0;
            newMainImage = updatedImages[0]?.image || "/placeholder.svg";
        } else if (selectedImageIndex > index) {
            newSelectedIndex = selectedImageIndex - 1;
            newMainImage = updatedImages[newSelectedIndex]?.image || "/placeholder.svg";
        }
        setSelectedImageIndex(newSelectedIndex);
        setProduct({
            ...product,
            images: updatedImages,
            image: newMainImage,
        });
    };

    const handleSelectAttribute = (attribute, group) => {
        if (attribute.attribute_type === "boolean") {
            const newAttribute = {
                id: attribute.id || attribute.attribute_id,
                name: attribute.name || attribute.attribute_name,
                value: "",
                attribute_type: attribute.attribute_type,
            };
            setProduct({
                ...product,
                attributes: [...product.attributes, newAttribute],
            });
            setShowAddAttributeDialog(false);
        } else {
            setSelectedAttribute({ ...attribute, attribute_type: attribute.attribute_type });
            setSelectedSpecGroup(group);
            setShowAddAttributeDialog(false);
            setShowAddValueDialog(true);
            setAttributeValue("");
        }
    };

    const handleAddAttributeValue = () => {
        if (selectedAttribute && attributeValue && selectedSpecGroup) {
            if (!selectedAttribute.id) {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: "Không có id hợp lệ.",
                });
                return;
            }
            const newAttribute = {
                id: selectedAttribute.id,
                name: selectedAttribute.name,
                value: attributeValue,
                attribute_type: selectedAttribute.attribute_type,
            };
            setProduct({
                ...product,
                attributes: [...product.attributes, newAttribute],
            });
            setShowAddValueDialog(false);
            setSelectedAttribute(null);
            setSelectedSpecGroup(null);
            setAttributeValue("");
        } else {
            Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: "Vui lòng chọn thuộc tính và nhập giá trị.",
            });
        }
    };

    const handleEditAttribute = (attrIndex) => {
        const attribute = product.attributes[attrIndex];
        setEditingAttribute(attribute);
        setEditingAttrIndex(attrIndex);
        setEditAttributeValue(attribute.value);
        setShowEditValueDialog(true);
    };

    const handleUpdateAttributeValue = () => {
        if (editingAttrIndex !== null && editAttributeValue !== null) {
            const updatedAttributes = [...product.attributes];
            updatedAttributes[editingAttrIndex] = {
                id: updatedAttributes[editingAttrIndex].id,
                name: updatedAttributes[editingAttrIndex].name,
                value: editAttributeValue,
                attribute_type: updatedAttributes[editingAttrIndex].attribute_type,
            };
            setProduct({
                ...product,
                attributes: updatedAttributes,
            });
            setShowEditValueDialog(false);
            setEditingAttribute(null);
            setEditingAttrIndex(null);
            setEditAttributeValue("");
        }
    };

    const handleRemoveAttribute = (attrIndex) => {
        const updatedAttributes = [...product.attributes];
        updatedAttributes.splice(attrIndex, 1);
        setProduct({
            ...product,
            attributes: updatedAttributes,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !product.name.trim() ||
            !product.description.trim() ||
            !product.selling_price ||
            !product.category_id ||
            !product.unit_id ||
            !product.warrenty_time_id
        ) {
            Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: "Vui lòng điền đầy đủ các trường bắt buộc: Tên sản phẩm, Mô tả, Giá bán, Danh mục, Đơn vị, Thời gian bảo hành.",
            });
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit = {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                description_normal: product.description_normal,
                images: product.images.map((img) => ({ image: img.image })),
                selling_price: product.selling_price,
                category_id: product.category_id,
                unit_id: product.unit_id,
                warrenty_time_id: product.warrenty_time_id,
                is_hide: product.is_hide,
                status: product.status,
                attributes: product.attributes.map((attr) => ({
                    id: attr.id,
                    value: attr.value,
                })),
            };
            console.log("dataToSubmit", dataToSubmit);
            const res = await productApi.edit(dataToSubmit);
            if (res.error && res.error !== 0) {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: res.message || "Có lỗi xảy ra!",
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Thành công!",
                    text: "Cập nhật sản phẩm thành công",
                });
                navigate("/admin/products");
            }
        } catch (err) {
            const apiError = err?.response?.data?.errors?.[0]?.message || "Có lỗi xảy ra!";
            Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: apiError,
            });
            console.error("Submit error", err);
        } finally {
            setLoading(false);
        }
    };

    const getSelectedCategoryAttributes = () => {
        const flattenCategories = (cats) => {
            return cats.flatMap(cat => [
                cat,
                ...(cat.children ? flattenCategories(cat.children) : [])
            ]);
        };
        const selectedCategory = flattenCategories(categories).find(
            cat => cat.category_id === product.category_id
        );
        return selectedCategory?.attribute_groups || [];
    };

    const filteredAttributes = getSelectedCategoryAttributes()
        .filter((group) => group?.attributes && Array.isArray(group.attributes))
        .map((group) => ({
            id: group.group_id,
            name: group.group_name,
            type: "group",
            attributes: group.attributes
                .filter((attr) => !product.attributes.some((pa) => pa.id === attr.attribute_id))
                .map((attr) => ({
                    id: attr.attribute_id,
                    name: attr.attribute_name,
                    type: "attribute",
                    parentId: group.group_id,
                    attribute_type: attr.attribute_type,
                })),
        }))
        .flatMap((group) => [
            group,
            ...group.attributes.filter((attr) =>
                attr.name?.toLowerCase().includes(searchAttribute?.toLowerCase() ?? "")
            ),
        ]);

    const renderAttributeInput = (value, onChange, id) => {
        return (
            <Input
                id={id}
                value={value}
                onChange={onChange}
                className="w-2/3"
                placeholder="Nhập giá trị (VD: 220W)"
                type="text"
            />
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                    <Link to="/admin/products">
                        <ArrowLeft className="h-4 w-4" />
                        Trở về
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                    <TabsTrigger
                        value="info"
                        className="bg-gray-100 hover:bg-white data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
                    >
                        Thông tin sản phẩm
                    </TabsTrigger>
                    <TabsTrigger
                        value="specs"
                        className="bg-gray-100 hover:bg-white data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
                    >
                        Thông số kỹ thuật
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 pt-4">
                    <div className="rounded-lg bg-muted/30 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-6">
                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="name">Tên sản phẩm:</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={product.name}
                                            onChange={handleInputChange}
                                            className="bg-muted"
                                            placeholder="Nhập tên sản phẩm"
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
                                            placeholder="Nhập slug"
                                            disabled
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
                                    </div>

                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="categories">Danh mục:</Label>
                                        {loading ? (
                                            <div className="text-muted-foreground">Đang tải danh mục...</div>
                                        ) : error ? (
                                            <div className="text-red-500">{error}</div>
                                        ) : categories.length === 0 ? (
                                            <div className="text-muted-foreground">Không có danh mục nào</div>
                                        ) : (
                                            <Select
                                                value={product.category_id?.toString() || ""}
                                                onValueChange={handleCategoryChange}
                                            >
                                                <SelectTrigger id="categories" className="bg-muted w-full">
                                                    <SelectValue placeholder="Chọn danh mục" />
                                                </SelectTrigger>
                                                <SelectContent>{renderCategoryOptions(categories)}</SelectContent>
                                            </Select>
                                        )}
                                    </div>

                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="warrenty_time_id">Thời gian bảo hành:</Label>
                                        {loading ? (
                                            <div className="text-muted-foreground">Đang tải...</div>
                                        ) : error ? (
                                            <div className="text-red-500">{error}</div>
                                        ) : warrentyTimes.length === 0 ? (
                                            <div className="text-muted-foreground">Không có thời gian bảo hành</div>
                                        ) : (
                                            <Select
                                                value={product.warrenty_time_id?.toString() || ""}
                                                onValueChange={(value) => setProduct({ ...product, warrenty_time_id: Number.parseInt(value) })}
                                            >
                                                <SelectTrigger id="warrenty_time_id" className="bg-muted w-full">
                                                    <SelectValue placeholder="Chọn thời gian bảo hành" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {warrentyTimes.map((warranty) => (
                                                        <SelectItem key={warranty.id} value={warranty.id.toString()}>
                                                            {warranty.name || warranty.duration}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>

                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="unit_id">Đơn vị:</Label>
                                        {loading ? (
                                            <div className="text-muted-foreground">Đang tải...</div>
                                        ) : error ? (
                                            <div className="text-red-500">{error}</div>
                                        ) : units.length === 0 ? (
                                            <div className="text-muted-foreground">Không có đơn vị nào</div>
                                        ) : (
                                            <Select
                                                value={product.unit_id?.toString() || ""}
                                                onValueChange={(value) => setProduct({ ...product, unit_id: Number.parseInt(value) })}
                                            >
                                                <SelectTrigger id="unit_id" className="bg-muted w-full">
                                                    <SelectValue placeholder="Chọn đơn vị" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {units.map((unit) => (
                                                        <SelectItem key={unit.id} value={unit.id.toString()}>
                                                            {unit.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex flex-col items-center">
                                        <Label className="mb-2">Hình ảnh sản phẩm:</Label>
                                        <div
                                            className="relative flex h-[200px] w-[200px] cursor-pointer flex-col items-center justify-center rounded-md border bg-muted mb-4"
                                            onClick={() => document.getElementById("image-upload").click()}
                                        >
                                            {product?.images?.length > 0 ? (
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
                                                        className={`relative h-14 w-14 cursor-pointer rounded-md border-2 ${selectedImageIndex === imageStartIndex + index ? "border-primary" : "border-muted"} bg-muted overflow-hidden`}
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
                                                onClick={() => setImageStartIndex(Math.min((product?.images?.length || 0) - 4, imageStartIndex + 1))}
                                                disabled={imageStartIndex + 4 >= (product?.images?.length || 0)}
                                                className="h-8 w-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 disabled:opacity-30 ml-2"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 flex-col">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_hide"
                                                checked={product.is_hide}
                                                onCheckedChange={(checked) => setProduct({ ...product, is_hide: Boolean(checked) })}
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
                                                    <SelectItem value={PRODUCT.STOP_SELLING.toString()}>Ngừng bán</SelectItem>
                                                    <SelectItem value={PRODUCT.SOLD_OUT.toString()}>Hết hàng</SelectItem>
                                                    <SelectItem value={PRODUCT.ACTIVE.toString()}>Đang bán</SelectItem>
                                                    <SelectItem value={PRODUCT.DISCOUNT.toString()}>Giảm giá</SelectItem>
                                                    <SelectItem value={PRODUCT.FETURED.toString()}>Nổi bật</SelectItem>
                                                    <SelectItem value={PRODUCT.NEW.toString()}>Mới</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
                                    Hủy
                                </Button>
                                <Button type="submit" className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-1" disabled={loading}>
                                    {loading ? "Đang lưu..." : "Lưu"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </TabsContent>

                <TabsContent value="specs" className="space-y-4 pt-4">
                    <div className="rounded-lg bg-muted/30 p-6">
                        {product.category_id === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Bạn cần chọn danh mục trước.
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">Thông số kỹ thuật</h2>
                                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowAddAttributeDialog(true)}>
                                        <Plus className="h-4 w-4" />
                                        Thêm thuộc tính
                                    </Button>
                                </div>
                                {product.attributes.length > 0 ? (
                                    <div className="space-y-6">
                                        {product.attributes.map((attr, attrIndex) => (
                                            <Card key={attr.id || attrIndex} className="p-4">
                                                <div className="flex items-start group">
                                                    <div className="w-1/3 font-medium">{attr.name}:</div>
                                                    <div className="flex w-2/3 items-center justify-between">
                                                        <span>{attr.attribute_type === "boolean" ? "Có" : attr.value}</span>
                                                        <div className="flex gap-1">
                                                            {attr.attribute_type !== "boolean" && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEditAttribute(attrIndex)}
                                                                    className="invisible rounded-full p-1 text-blue-500 hover:bg-blue-50 group-hover:visible"
                                                                    title="Sửa"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveAttribute(attrIndex)}
                                                                className="invisible rounded-full p-1 text-red-500 hover:bg-red-50 group-hover:visible"
                                                                title="Xóa"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Chưa có thông số kỹ thuật nào. Nhấn "Thêm thuộc tính" để bắt đầu.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

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
                        {loading ? (
                            <div className="text-muted-foreground">Đang tải thuộc tính...</div>
                        ) : error ? (
                            <div className="text-red-500">{error}</div>
                        ) : filteredAttributes.length === 0 ? (
                            <div className="text-muted-foreground">Không có thuộc tính nào</div>
                        ) : (
                            <div className="max-h-[300px] space-y-2 overflow-y-auto">
                                {filteredAttributes
                                    .filter((item) => item.type === "group" && item.attributes && item.attributes.length > 0)
                                    .map((group) => (
                                        <div key={group.id} className="space-y-2">
                                            <div className="font-medium">{group.name}</div>
                                            <div className="space-y-2 pl-4">
                                                {group.attributes
                                                    .filter((attr) =>
                                                        attr.name?.toLowerCase().includes(searchAttribute?.toLowerCase() ?? "")
                                                    )
                                                    .map((attr) => (
                                                        <div
                                                            key={attr.id}
                                                            className="flex cursor-pointer items-center justify-between rounded-md border p-2 hover:bg-muted"
                                                            onClick={() => handleSelectAttribute(attr, group)}
                                                        >
                                                            <span>{attr.name}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showAddValueDialog} onOpenChange={setShowAddValueDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Thêm giá trị thuộc tính</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                            <Label htmlFor="attributeValue" className="w-1/3 text-right">
                                {selectedAttribute?.name || "Thuộc tính"}:
                            </Label>
                            {renderAttributeInput(
                                attributeValue,
                                (e) => setAttributeValue(e.target.value),
                                "attributeValue"
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowAddValueDialog(false);
                                setSelectedAttribute(null);
                                setSelectedSpecGroup(null);
                                setAttributeValue("");
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleAddAttributeValue}
                            disabled={!selectedAttribute || !attributeValue.trim()}
                        >
                            Lưu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditValueDialog} onOpenChange={setShowEditValueDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Sửa giá trị thuộc tính</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                            <Label htmlFor="editAttributeValue" className="w-1/3 text-right">
                                {editingAttribute?.name || "Thuộc tính"}:
                            </Label>
                            {renderAttributeInput(
                                editAttributeValue,
                                (e) => setEditAttributeValue(e.target.value),
                                "editAttributeValue"
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowEditValueDialog(false);
                                setEditingAttribute(null);
                                setEditingAttrIndex(null);
                                setEditAttributeValue("");
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleUpdateAttributeValue}
                            disabled={!editAttributeValue?.trim()}
                            className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-1"
                        >
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}