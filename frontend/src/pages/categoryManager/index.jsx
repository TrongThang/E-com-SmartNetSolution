"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, MoreVertical, Plus, Search, Folder } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import CategoriesTable from "@/components/common/Table/CategoriesTable";
import categoryApi from "@/apis/modules/categories.api.ts";
import ActionsColumn from "@/components/common/Table/ActionsColumn"
import { Button } from "@/components/ui/button"

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("info");
    const [filteredCategories, setFilteredCategories] = useState([]);


    const fetchCategories = async () => {
        try {
            const res = await categoryApi.list({});
            setCategories(res.data?.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredCategories(categories);
            return;
        }

        const searchInCategory = (category) => {
            const matches = category.name.toLowerCase().includes(searchTerm.toLowerCase());
            const childrenMatches = category.children?.map(child => searchInCategory(child)) || [];
            return matches || childrenMatches.some(match => match);
        };

        const filtered = categories.filter(category => searchInCategory(category));
        setFilteredCategories(filtered);

        // Tự động mở các danh mục cha chứa kết quả tìm kiếm
        const expandParentCategories = (category) => {
            if (category.children?.some(child => searchInCategory(child))) {
                setExpandedCategories(prev => [...prev, category.category_id]);
                category.children.forEach(expandParentCategories);
            }
        };

        filtered.forEach(expandParentCategories);
    }, [searchTerm, categories]);

    const toggleCategory = (categoryId) => {
        if (expandedCategories.includes(categoryId)) {
            setExpandedCategories(expandedCategories.filter((id) => id !== categoryId));
        } else {
            setExpandedCategories([...expandedCategories, categoryId]);
        }
    };

    const selectCategory = (category) => {
        setSelectedCategory(category);
    };

    const handleAddCategory = () => {
        // Xử lý thêm danh mục
    };

    const handleEditCategory = (category) => {
        // Xử lý sửa danh mục
        console.log("Edit category:", category);
    };

    const handleDeleteCategory = (category) => {
        // Xử lý xóa danh mục
        console.log("Delete category:", category);
    };

    // Hàm đệ quy để render cây danh mục
    const renderCategoryTree = (categoryList, parentId = null, level = 0) => {
        return categoryList
            .filter(cat => cat.parent_id === parentId)
            .map(category => (
                <div key={category.category_id}>
                    <div className="flex items-start">
                        <div
                            className={`flex items-center py-1 px-2 rounded-md flex-1 cursor-pointer hover:bg-gray-50 ${selectedCategory?.category_id === category.category_id ? "bg-gray-100" : ""}`}
                            onClick={() => {
                                selectCategory(category);
                                if (category.children?.length > 0) {
                                    toggleCategory(category.category_id);
                                }
                            }}
                        >
                            <Folder size={16} className="mr-2 text-gray-500" />
                            <span className="text-sm flex-1">
                                {category.name}
                                {searchTerm && category.name.toLowerCase().includes(searchTerm.toLowerCase()) && (
                                    <span className="ml-1 text-xs text-blue-500">(match)</span>
                                )}
                            </span>
                            {category.children?.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCategory(category.category_id);
                                    }}
                                    className={`p-1 transition-transform duration-200 ${expandedCategories.includes(category.category_id) ? "rotate-90" : ""}`}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {expandedCategories.includes(category.category_id) && category.children?.length > 0 && (
                        <div className="ml-6">
                            {renderCategoryTree(category.children, category.category_id, level + 1)}
                        </div>
                    )}
                </div>
            ));
    };

    return (
        <div className="max-w-7xl">
            <h1 className="text-xl font-semibold mb-6">Quản lý danh mục</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="border rounded-md shadow-sm">
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                            <h2 className="font-medium">Danh mục</h2>
                            <Button
                                onClick={handleAddCategory}
                                className="bg-black text-white text-sm px-3 py-1.5 rounded flex items-center"
                            >
                                <Plus size={16} className="mr-1" /> Thêm danh mục
                            </Button>
                        </div>

                        <div className="mt-4 relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="p-2">
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-red-500 p-4">{error}</div>
                        ) : (
                            <div className="space-y-1">
                                {renderCategoryTree(filteredCategories)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column - Category details and table */}
                <div className="md:col-span-2 space-y-6">
                    {/* Category details */}
                    {selectedCategory && (
                        <>
                            <div className="space-y-6 border shadow-sm rounded-lg">
                                {/* Chi tiết danh mục */}
                                <div className="bg-white shadow-sm rounded-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">Chi tiết danh mục</h2>
                                            <p className="text-sm text-gray-500">Thông tin chi tiết về danh mục đã chọn</p>
                                        </div>
                                        <ActionsColumn
                                            row={selectedCategory}
                                            onEdit={handleEditCategory}
                                            onDelete={handleDeleteCategory}
                                        />
                                    </div>

                                    {/* Tabs */}
                                    <div className="border-b border-gray-200 mb-6">
                                        <nav className="-mb-px flex space-x-8">
                                            <button
                                                onClick={() => setActiveTab("info")}
                                                className={`border-b-2 ${activeTab === "info"
                                                    ? "border-black text-gray-900"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                    } text-sm font-medium py-4`}
                                            >
                                                Thông tin chung
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("attributes")}
                                                className={`border-b-2 ${activeTab === "attributes"
                                                    ? "border-black text-gray-900"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                    } text-sm font-medium py-4`}
                                            >
                                                Nhóm thuộc tính
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("subcategories")}
                                                className={`border-b-2 ${activeTab === "subcategories"
                                                    ? "border-black text-gray-900"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                    } text-sm font-medium py-4`}
                                            >
                                                Danh mục con
                                            </button>
                                        </nav>
                                    </div>

                                    {/* Tab content */}
                                    {activeTab === "info" ? (
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
                                            <div>
                                                <span className="text-gray-500">Tên danh mục:</span>
                                                <div className="font-medium">{selectedCategory.name}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Danh mục cha:</span>
                                                <div>
                                                    {selectedCategory.parent_id ?
                                                        categories.find(c => c.category_id === selectedCategory.parent_id)?.name :
                                                        "Không có"}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Slug:</span>
                                                <div>{selectedCategory.slug}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Trạng thái:</span>
                                                <div>{selectedCategory.is_hide ? "Ẩn" : "Hiển thị"}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Ngày tạo:</span>
                                                <div>
                                                    {selectedCategory.created_at
                                                        ? new Date(selectedCategory.created_at).toLocaleString("vi-VN")
                                                        : "Chưa có"}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Ngày cập nhật:</span>
                                                <div>
                                                    {selectedCategory.updated_at
                                                        ? new Date(selectedCategory.updated_at).toLocaleString("vi-VN")
                                                        : "Chưa cập nhật"}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-gray-500">Mô tả:</span>
                                                <div>{selectedCategory.description || "Chưa có mô tả"}</div>
                                            </div>
                                        </div>
                                    ) : activeTab === "attributes" ? (
                                        <div className="space-y-4">
                                            {selectedCategory.attribute_groups && selectedCategory.attribute_groups.length > 0 ? (
                                                selectedCategory.attribute_groups.map(group => (
                                                    <div key={group.group_id} className="bg-gray-50 p-4 rounded-lg">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h3 className="font-medium text-gray-900">{group.group_name}</h3>
                                                            <span className="text-xs text-gray-500">
                                                                {group.attributes.length} thuộc tính
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {group.attributes.map(attr => (
                                                                <span
                                                                    key={attr.attribute_id}
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                                                >
                                                                    {attr.attribute_name}
                                                                    {attr.required && (
                                                                        <span className="ml-1 text-red-500">*</span>
                                                                    )}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-gray-500 text-sm">
                                                    Chưa có nhóm thuộc tính nào được gán cho danh mục này
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {selectedCategory.children && selectedCategory.children.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {selectedCategory.children.map(child => (
                                                        <div
                                                            key={child.category_id}
                                                            className="bg-gray-50 px-6 py-2 me-7 rounded-lg"
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <h3 className="text-sm text-gray-900">{child.name}</h3>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        {child.children?.length || 0} danh mục con
                                                                    </p>
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {child.is_hide ? "Ẩn" : "Hiển thị"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500 text-sm">
                                                    Chưa có danh mục con nào
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}