"use client"
import { Edit, Trash2, Eye, Package } from "lucide-react"
import { useState } from "react"
import ComponentDetails from "./template-component-details"
import TemplateComponentDetails from "./template-component-details"

export default function TemplateList({ templates, onEdit, onDelete }) {
    const [expandedTemplate, setExpandedTemplate] = useState([])
    const [templateComponents, setTemplateComponents] = useState({})

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const handleTemplateClick = (template) => {
        const id = template.template_id

        const isExpanded = expandedTemplate.includes(id)
        let updatedTemplates

        if (isExpanded) {
            // Loại bỏ template_id khỏi danh sách
            updatedTemplates = expandedTemplate.filter(tid => tid !== id)
        } else {
            // Thêm template_id vào danh sách
            updatedTemplates = [...expandedTemplate, id]

            setExpandedTemplate(template.template_id)
            
            // Giả lập lấy dữ liệu nếu chưa có
        if (!templateComponents[id]) {
            const mockComponents = [
                { component_id: 1, name: "Compressor Daikin", supplier: "Daikin Vietnam", quantity_required: 1, unit_cost: 2500000 },
                { component_id: 2, name: "Fan Motor", supplier: "Panasonic", quantity_required: 2, unit_cost: 450000 },
                { component_id: 3, name: "Control Board", supplier: "Samsung Electronics", quantity_required: 1, unit_cost: 850000 },
                { component_id: 4, name: "Copper Tube", supplier: "Local Supplier", quantity_required: 5, unit_cost: 120000 },
                { component_id: 5, name: "Refrigerant R32", supplier: "Daikin Vietnam", quantity_required: 2, unit_cost: 180000 },
            ]
            setTemplateComponents(prev => ({
                ...prev,
                [id]: mockComponents,
            }))
            }
        }
        console.log(updatedTemplates)
        setExpandedTemplate(updatedTemplates)

    }

    const handleActionClick = (e, action, template) => {
        e.stopPropagation() // Prevent row click when clicking action buttons
        if (action === "edit") {
            onEdit(template)
        } else if (action === "delete") {
            onDelete(template.template_id)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Template
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Loại thiết bị
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số linh kiện
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tổng chi phí
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Người tạo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày tạo
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {templates.map((template) => (
                            <>
                                <tr
                                    key={template.template_id}
                                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${expandedTemplate === template.template_id ? "bg-blue-50" : ""
                                        }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{template.name}</div>
                                                <div className="text-sm text-gray-500">ID: {template.template_id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {template.device_type_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{template.component_count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatCurrency(template.total_cost)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{template.created_by}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.created_at}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Xem chi tiết"
                                                onClick={() => handleTemplateClick(template)}

                                            >
                                                <Eye size={25} />
                                            </button>
                                            <button
                                                onClick={(e) => handleActionClick(e, "edit", template)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={25} />
                                            </button>
                                            <button
                                                onClick={(e) => handleActionClick(e, "delete", template)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Xóa"
                                            >
                                                <Trash2 size={25} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Expanded Component Details Row */}
                                {expandedTemplate.includes(template.template_id) && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 bg-gray-50">
                                            <TemplateComponentDetails
                                                components={templateComponents[template.template_id] || []}
                                                templateName={template.name}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            {templates.length === 0 && (
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Không có template nào</h3>
                    <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo template đầu tiên.</p>
                </div>
            )}
        </div>
    )
}
