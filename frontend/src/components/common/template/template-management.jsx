"use client";
import { useEffect, useState } from "react";
import { Plus, Search, Package, Settings, Code } from "lucide-react";
import TemplateForm from "@/components/common/template/template-form";
import ComponentManager from "@/components/common/component/component-manager";
import TemplateList from "@/components/common/template/template-list";
import { cn } from "@/lib/utils";
import FirmwarePage from "@/components/firmware/firmware-manager";
import { removeVietnameseTones } from "@/utils/format";
import Swal from "sweetalert2";
import categoryApi from "@/apis/modules/categories.api.ts";
import axiosIOTPublic from "@/apis/clients/iot.private.client";
import axiosPublic from "@/apis/clients/public.client";

export default function TemplateManagement() {
    const [activeTab, setActiveTab] = useState("Templates");
    const [showTemplateForm, setShowTemplateForm] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTerm, setFilterTerm] = useState("all");

    const [templates, setTemplates] = useState([]);
    const [components, setComponents] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchTemplate = async () => {
        try {
            const res = await axiosIOTPublic.get('device-templates');
            
            setTemplates(res);
        } catch (error) {
            console.error('Failed to fetch device templates:', error);
            Swal.fire({
                title: "Lỗi",
                text: "Không thể tải danh sách khuôn mẫu. Vui lòng thử lại!",
                icon: "error",
            });
        }
    };

    const fetchComponent = async () => {
        try {
            const res = await axiosIOTPublic.get('component');
            
            setComponents(res);
        } catch (error) {
            console.error('Failed to fetch component:', error);
            Swal.fire({
                title: "Lỗi",
                text: "Không thể tải danh sách linh kiện. Vui lòng thử lại!",
                icon: "error",
            });
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axiosPublic.get('categories');
            if (res.status_code === 200) {
                const flattenCategories = flattenCategoryTree(res.data?.categories || []);
                setCategories(flattenCategories);
                console.log("Flattened categories:", flattenCategories); // Debug dữ liệu
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            Swal.fire({
                title: "Lỗi",
                text: "Không thể tải danh sách danh mục. Vui lòng thử lại!",
                icon: "error",
            });
        }
    };

    const flattenCategoryTree = (categories, level = 0, parentId = null) => {
        let result = [];
        for (const category of categories) {
            result.push({
                ...category,
                level,
                parentId,
            });
            if (category.children && category.children.length > 0) {
                result = result.concat(flattenCategoryTree(category.children, level + 1, category.category_id));
            }
        }
        return result;
    };

    const createTemplate = async (dataTemplate) => {
        try {
            const res = await axiosIOTPublic.post('device-templates', dataTemplate);
            console.log("Create template response:", res);
            if (res.status === 201) {
                Swal.fire({
                    title: "Thành công",
                    text: "Khuôn mẫu đã được tạo thành công",
                    icon: "success",
                });
                fetchTemplate();
            } else {
                Swal.fire({
                    title: "Lỗi",
                    text: res.data.error || "Có lỗi xảy ra khi tạo khuôn mẫu",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error('Failed to create template:', error);
            Swal.fire({
                title: "Lỗi",
                text: error.response?.data?.error || "Có lỗi xảy ra khi tạo khuôn mẫu",
                icon: "error",
            });
        }
    };

    const updateTemplate = async (dataTemplate) => {
        try {
            const res = await axiosIOTPublic.put(`device-templates/${editingTemplate.template_id}`, dataTemplate);
            console.log("Update template response:", res);
            if (res.status === 200) {
                Swal.fire({
                    title: "Thành công",
                    text: "Khuôn mẫu đã được cập nhật thành công",
                    icon: "success",
                });
                fetchTemplate();
            } else {
                Swal.fire({
                    title: "Lỗi",
                    text: res.data.error || "Có lỗi xảy ra khi cập nhật khuôn mẫu",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error('Failed to update template:', error);
            Swal.fire({
                title: "Lỗi",
                text: error.response?.data?.error || "Có lỗi xảy ra khi cập nhật khuôn mẫu",
                icon: "error",
            });
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchTemplate();
        fetchComponent();
    }, []);

    const handleCreateTemplate = () => {
        setEditingTemplate(null);
        setShowTemplateForm(true);
    };

    const handleEditTemplate = (template) => {
        setEditingTemplate(template);
        setShowTemplateForm(true);
    };

    const deleteTemplate = async (templateId) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Khuôn mẫu sẽ bị xóa khỏi hệ thống!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosIOTPublic.delete(`device-templates/${templateId}`);
                if (res.status === 204) {
                    Swal.fire({
                        title: "Thành công",
                        text: "Khuôn mẫu đã được xóa",
                        icon: "success",
                    });
                    fetchTemplate();
                } else {
                    Swal.fire({
                        title: "Lỗi",
                        text: res.data.error || "Có lỗi xảy ra khi xóa khuôn mẫu",
                        icon: "error",
                    });
                }
            } catch (error) {
                console.error('Failed to delete template:', error);
                Swal.fire({
                    title: "Lỗi",
                    text: error.response?.data?.error || "Có lỗi xảy ra khi xóa khuôn mẫu",
                    icon: "error",
                });
            }
        }
    };

    const handleSaveTemplate = (templateData) => {
        if (editingTemplate) {
            updateTemplate(templateData);
        } else {
            createTemplate(templateData);
        }
        setShowTemplateForm(false);
        setEditingTemplate(null);
    };

    const handleChangeStatus = (templateId, newStatus) => {
        setTemplates(
            templates.map((t) =>
                t.template_id === templateId ? { ...t, status: newStatus, updated_at: new Date().toISOString().split("T")[0] } : t
            )
        );
    };

    const handleCostChange = (templateId, value) => {
        const updatedValue = parseFloat(value);
        setTemplates((prev) =>
            prev.map((template) =>
                template.template_id === templateId
                    ? { ...template, manufacturing_cost: updatedValue, updated_at: new Date().toISOString().split("T")[0] }
                    : template
            )
        );
    };

    // Cải thiện logic tìm kiếm và lọc
    const filteredTemplates = templates.filter((template) => {
        const templateName = template.name ? template.name.toLowerCase() : "";
        const deviceTypeName = template.device_type_name ? template.device_type_name.toLowerCase() : "";
        const normalizedSearchTerm = removeVietnameseTones(searchTerm.toLowerCase());

        const matchesSearch =
            removeVietnameseTones(templateName).includes(normalizedSearchTerm) ||
            removeVietnameseTones(deviceTypeName).includes(normalizedSearchTerm);

        const matchesFilter = filterTerm === "all" || deviceTypeName === filterTerm.toLowerCase();

        return matchesSearch && matchesFilter;
    });

    // Lấy danh sách danh mục con để hiển thị trong bộ lọc
    const childCategories = categories.filter((category) => category.parentId !== null);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Quản lý khuôn mẫu sản xuất <span className="mx-2">→</span> {activeTab}
                            </h1>
                        </div>
                        <button
                            onClick={handleCreateTemplate}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
                        >
                            <Plus size={20} />
                            <span>Tạo Template</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab("Templates")}
                            className={cn(
                                "py-4 px-1 border-b-2 font-medium text-sm",
                                activeTab === "Templates"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                            )}
                        >
                            <Package className="inline mr-2" size={16} />
                            Khuôn mẫu
                        </button>
                        <button
                            onClick={() => setActiveTab("Components")}
                            className={cn(
                                "py-4 px-1 border-b-2 font-medium text-sm",
                                activeTab === "Components"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                            )}
                        >
                            <Settings className="inline mr-2" size={16} />
                            Linh kiện
                        </button>
                        <button
                            onClick={() => setActiveTab("Firmware")}
                            className={cn(
                                "py-4 px-1 border-b-2 font-medium text-sm",
                                activeTab === "Firmware"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                            )}
                        >
                            <Code className="inline mr-2" size={16} />
                            Firmware
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === "Templates" && (
                    <div>
                        {/* Search and Filters */}
                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên hoặc loại thiết bị..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setFilterTerm(e.target.value)}
                                value={filterTerm}
                            >
                                <option value="all">Tất cả loại thiết bị</option>
                                {childCategories.map((category) => (
                                    <option key={category.category_id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <TemplateList
                            templates={filteredTemplates}
                            onEdit={handleEditTemplate}
                            onDelete={deleteTemplate}
                            onChangeStatus={handleChangeStatus}
                            handleCostChange={handleCostChange}
                        />
                    </div>
                )}

                {activeTab === "Components" && <ComponentManager components={components} setComponents={setComponents} fetchComponent={fetchComponent} />}
                {activeTab === "Firmware" && <FirmwarePage />}
            </div>

            {/* Template Form Modal */}
            {showTemplateForm && (
                <TemplateForm
                    template={editingTemplate}
                    components={components}
                    setComponents={setComponents}
                    onSave={handleSaveTemplate}
                    onCancel={() => {
                        setShowTemplateForm(false);
                        setEditingTemplate(null);
                    }}
                />
            )}
        </div>
    );
}