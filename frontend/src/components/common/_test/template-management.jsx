"use client"
import { useState } from "react"
import { Plus, Search, Package, Settings } from "lucide-react"
import TemplateForm from "@/components/common/_test/template-form"
import ComponentManager from "@/components/common/_test/component-manager"
import TemplateList from "@/components/common/_test/template-list"
import { cn } from "@/lib/utils"

export default function TemplateManagement() {
    const [activeTab, setActiveTab] = useState("templates")
    const [showTemplateForm, setShowTemplateForm] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    // Mock data - in real app, this would come from API
    const [templates, setTemplates] = useState([
        {
            template_id: 1,
            name: "Máy lạnh Daikin 12000BTU",
            device_type_id: 1,
            device_type_name: "Máy lạnh",
            created_by: "Admin",
            created_at: "2024-01-15",
            component_count: 15,
            total_cost: 12500000,
        },
        {
            template_id: 2,
            name: "Tủ lạnh Samsung 350L",
            device_type_id: 2,
            device_type_name: "Tủ lạnh",
            created_by: "Manager",
            created_at: "2024-01-10",
            component_count: 22,
            total_cost: 8900000,
        },
        {
            template_id: 3,
            name: "Máy giặt LG 9kg",
            device_type_id: 3,
            device_type_name: "Máy giặt",
            created_by: "Admin",
            created_at: "2024-01-08",
            component_count: 18,
            total_cost: 6750000,
        },
    ])

    const [components, setComponents] = useState([
        {
            component_id: 1,
            name: "Compressor Daikin",
            supplier: "Daikin Vietnam",
            quantity_in_stock: 50,
            unit_cost: 2500000,
            created_at: "2024-01-01",
        },
        {
            component_id: 2,
            name: "Fan Motor",
            supplier: "Panasonic",
            quantity_in_stock: 120,
            unit_cost: 450000,
            created_at: "2024-01-01",
        },
        {
            component_id: 3,
            name: "Control Board",
            supplier: "Samsung Electronics",
            quantity_in_stock: 80,
            unit_cost: 850000,
            created_at: "2024-01-01",
        },
    ])

    const handleCreateTemplate = () => {
        setEditingTemplate(null)
        setShowTemplateForm(true)
    }

    const handleEditTemplate = (template) => {
        setEditingTemplate(template)
        setShowTemplateForm(true)
    }

    const handleDeleteTemplate = (templateId) => {
        if (alert("Bạn có chắc chắn muốn xóa template này?")) {
            setTemplates(templates.filter((t) => t.template_id !== templateId))
        }
    }

    const handleSaveTemplate = (templateData) => {
        if (editingTemplate) {
            // Update existing template
            setTemplates(
                templates.map((t) => (t.template_id === editingTemplate.template_id ? { ...t, ...templateData } : t)),
            )
        } else {
            // Create new template
            const newTemplate = {
                ...templateData,
                template_id: Math.max(...templates.map((t) => t.template_id)) + 1,
                created_at: new Date().toISOString().split("T")[0],
                component_count: templateData.components?.length || 0,
                total_cost: templateData.components?.reduce((sum, c) => sum + c.quantity_required * c.unit_cost, 0) || 0,
            }
            setTemplates([...templates, newTemplate])
        }
        setShowTemplateForm(false)
        setEditingTemplate(null)
    }

    const filteredTemplates = templates.filter((template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý khuôn mẫu sản xuất</h1>
                            <p className="text-gray-600">Tạo và quản lý các template cho sản phẩm</p>
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
                            onClick={() => setActiveTab("templates")}
                            className={cn(
                                "py-4 px-1 border-b-2 font-medium text-sm",
                                activeTab === "templates"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                            )}
                        >
                            <Package className="inline mr-2" size={16} />
                            Templates
                        </button>
                        <button
                            onClick={() => setActiveTab("components")}
                            className={cn(
                                "py-4 px-1 border-b-2 font-medium text-sm",
                                activeTab === "components"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                            )}
                        >
                            <Settings className="inline mr-2" size={16} />
                            Components
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === "templates" && (
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
                            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Tất cả loại thiết bị</option>
                                <option value="1">Máy lạnh</option>
                                <option value="2">Tủ lạnh</option>
                                <option value="3">Máy giặt</option>
                            </select>
                        </div>

                        <TemplateList templates={filteredTemplates} onEdit={handleEditTemplate} onDelete={handleDeleteTemplate} />
                    </div>
                )}

                {activeTab === "components" && <ComponentManager components={components} setComponents={setComponents} />}
            </div>

            {/* Template Form Modal */}
            {showTemplateForm && (
                <TemplateForm
                    template={editingTemplate}
                    components={components}
                    onSave={handleSaveTemplate}
                    onCancel={() => {
                        setShowTemplateForm(false)
                        setEditingTemplate(null)
                    }}
                />
            )}
        </div>
    )
}
