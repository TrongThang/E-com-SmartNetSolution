"use client";
import { useEffect, useState } from "react";
import { Plus, Search, Package, Settings, Code } from "lucide-react";
import TemplateForm from "@/components/common/template/template-form";
import ComponentManager from "@/components/common/component/component-manager";
import TemplateList from "@/components/common/template/template-list";
import { cn } from "@/lib/utils";
import FirmwarePage from "@/components/firmware/firmware-manager";
import { removeVietnameseTones } from "@/utils/format";
import axios from "axios";

export default function TemplateManagement() {
    const [activeTab, setActiveTab] = useState("Templates");
    const [showTemplateForm, setShowTemplateForm] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTerm, setFilterTerm] = useState("all");

    const [templates, setTemplates] = useState([]);
    const [components, setComponents] = useState([]);

    const fetchTemplate = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/device-templates');
            setTemplates(res.data);
        } catch (error) {
            console.error('Failed to fetch device templates:', error);
        }
    }

    const fetchComponent = async () => {
        try {
            // const res = await ComponentApi.list();
            const res = await axios.get('http://localhost:3000/api/component');
            setComponents(res.data.data);
        } catch (error) {
            console.error('Failed to fetch component:', error);
        }
    }

    useEffect(() => {
        fetchTemplate();
        fetchComponent();
    },[])

    const handleCreateTemplate = () => {
        setEditingTemplate(null);
        setShowTemplateForm(true);
    };

    const handleEditTemplate = (template) => {
        setEditingTemplate(template);
        setShowTemplateForm(true);
    };

    const handleDeleteTemplate = (templateId) => {
        if (console.confirm("Bạn có chắc chắn muốn xóa template này?")) {
            setTemplates(templates.filter((t) => t.template_id !== templateId));
        }
    };

    const handleSaveTemplate = (templateData) => {
        if (editingTemplate) {
            // Update existing template
            setTemplates(
                templates.map((t) => (t.template_id === editingTemplate.template_id ? { ...t, ...templateData } : t)),
            );
        } else {
            // Create new template
            const newTemplate = {
                ...templateData,
                template_id: Math.max(...templates.map((t) => t.template_id)) + 1,
                created_at: new Date().toISOString().split("T")[0],
                updated_at: new Date().toISOString().split("T")[0],
                component_count: templateData.component_count || 0,
                total_cost: templateData.components?.reduce((sum, c) => sum + c.quantity_required * c.unit_cost, 0) || 0,
            };
            setTemplates([...templates, newTemplate]);
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

    // const filteredTemplates = templates.filter((template) => {
    //     const matchesSearch = removeVietnameseTones(template.name.toLowerCase()).includes(
    //         removeVietnameseTones(searchTerm.toLowerCase()),
    //     );
    //     const matchesFilter = filterTerm === "all" || template.device_type_name === filterTerm;
    //     return matchesSearch && matchesFilter;
    // });

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
                                    placeholder="Tìm kiếm template..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setFilterTerm(e.target.value)}
                            >
                                <option value="all">Tất cả loại thiết bị</option>
                                <option value="Máy lạnh">Máy lạnh</option>
                                <option value="Tủ lạnh">Tủ lạnh</option>
                                <option value="Máy giặt">Máy giặt</option>
                            </select>
                        </div>

                        <TemplateList
                            templates={templates}
                            onEdit={handleEditTemplate}
                            onDelete={handleDeleteTemplate}
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