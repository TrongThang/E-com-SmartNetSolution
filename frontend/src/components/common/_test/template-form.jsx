"use client"
import { useState, useEffect } from "react"
import { X, Plus, Minus, Search } from "lucide-react"

export default function TemplateForm({ template, components, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        device_type_id: "",
        device_type_name: "",
        created_by: "Admin",
        components: [],
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [showComponentSearch, setShowComponentSearch] = useState(false)

    useEffect(() => {
        if (template) {
            setFormData({
                name: template.name,
                device_type_id: template.device_type_id,
                device_type_name: template.device_type_name,
                created_by: template.created_by,
                components: template.components || [],
            })
        }
    }, [template])

    const deviceTypes = [
        { id: 1, name: "Máy lạnh" },
        { id: 2, name: "Tủ lạnh" },
        { id: 3, name: "Máy giặt" },
        { id: 4, name: "Máy rửa bát" },
    ]

    const filteredComponents = components.filter(
        (component) =>
            component.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !formData.components.some((c) => c.component_id === component.component_id),
    )

    const addComponent = (component) => {
        setFormData({
            ...formData,
            components: [
                ...formData.components,
                {
                    ...component,
                    quantity_required: 1,
                },
            ],
        })
        setShowComponentSearch(false)
        setSearchTerm("")
    }

    const removeComponent = (componentId) => {
        setFormData({
            ...formData,
            components: formData.components.filter((c) => c.component_id !== componentId),
        })
    }

    const updateComponentQuantity = (componentId, quantity) => {
        setFormData({
            ...formData,
            components: formData.components.map((c) =>
                c.component_id === componentId ? { ...c, quantity_required: Math.max(1, quantity) } : c,
            ),
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.name || !formData.device_type_id) {
            alert("Vui lòng điền đầy đủ thông tin")
            return
        }
        onSave(formData)
    }

    const totalCost = formData.components.reduce((sum, c) => sum + c.quantity_required * c.unit_cost, 0)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">{template ? "Chỉnh sửa Template" : "Tạo Template mới"}</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tên Template *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập tên template"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Loại thiết bị *</label>
                                <select
                                    value={formData.device_type_id}
                                    onChange={(e) => {
                                        const selectedType = deviceTypes.find((type) => type.id === Number.parseInt(e.target.value))
                                        setFormData({
                                            ...formData,
                                            device_type_id: e.target.value,
                                            device_type_name: selectedType?.name || "",
                                        })
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Chọn loại thiết bị</option>
                                    {deviceTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Components Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Linh kiện ({formData.components.length})</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowComponentSearch(true)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-green-700"
                                >
                                    <Plus size={16} />
                                    <span>Thêm linh kiện</span>
                                </button>
                            </div>

                            {/* Component Search Modal */}
                            {showComponentSearch && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
                                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                                        <div className="p-4 border-b">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold">Chọn linh kiện</h3>
                                                <button
                                                    onClick={() => setShowComponentSearch(false)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                            <div className="relative mb-4">
                                                <Search
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                    size={16}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Tìm kiếm linh kiện..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center mb-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowComponentSearch(true)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-green-700"
                                                >
                                                    <Plus size={16} />
                                                    <span>Tạo linh kiện mới</span>
                                                    {/* Tách component-form ra và gọi ở đây nếu cần */}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 max-h-96 overflow-y-auto">
                                            {filteredComponents.map((component) => (
                                                <div
                                                    key={component.component_id}
                                                    onClick={() => addComponent(component)}
                                                    className="p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h4 className="font-medium">{component.name}</h4>
                                                            <p className="text-sm text-gray-600">Nhà cung cấp: {component.supplier}</p>
                                                            <p className="text-sm text-gray-600">Tồn kho: {component.quantity_in_stock}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium">
                                                                {new Intl.NumberFormat("vi-VN", {
                                                                    style: "currency",
                                                                    currency: "VND",
                                                                }).format(component.unit_cost)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Selected Components */}
                            <div className="space-y-3">
                                {formData.components.map((component) => (
                                    <div key={component.component_id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <h4 className="font-medium">{component.name}</h4>
                                                <p className="text-sm text-gray-600">Nhà cung cấp: {component.supplier}</p>
                                                <p className="text-sm text-gray-600">
                                                    Đơn giá:{" "}
                                                    {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }).format(component.unit_cost)}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateComponentQuantity(component.component_id, component.quantity_required - 1)
                                                        }
                                                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-12 text-center font-medium">{component.quantity_required}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateComponentQuantity(component.component_id, component.quantity_required + 1)
                                                        }
                                                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <div className="text-right min-w-[120px]">
                                                    <p className="font-medium">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(component.quantity_required * component.unit_cost)}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeComponent(component.component_id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Cost */}
                            {formData.components.length > 0 && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium">Tổng chi phí:</span>
                                        <span className="text-xl font-bold text-blue-600">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(totalCost)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        {template ? "Cập nhật" : "Tạo Template"}
                    </button>
                </div>
            </div>
        </div>
    )
}
