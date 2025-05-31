"use client";
import { Edit, Package, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import TemplateComponentDetails from "./template-component-details";

export default function TemplateList({ templates, onEdit, onDelete, onChangeStatus, handleCostChange }) {
    const [expandedTemplate, setExpandedTemplate] = useState([]);
    const [totalCosts, setTotalCosts] = useState({});

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Tính totalCost cho tất cả templates
    useEffect(() => {
        const costs = {};
        templates.forEach((template) => {
            const cost = (template.components || []).reduce(
                (sum, component) =>
                    sum + (component.quantity_required || 0) * (parseFloat(component.unit_cost) || 0),
                0
            );
            costs[template.template_id] = cost;
        });
        setTotalCosts(costs);
    }, [templates]);

    const handleTemplateClick = (template) => {
        const id = template.template_id;
        const isExpanded = expandedTemplate.includes(id);
        let updatedTemplates;

        if (isExpanded) {
            updatedTemplates = expandedTemplate.filter((tid) => tid !== id);
        } else {
            updatedTemplates = [...expandedTemplate, id];
        }
        setExpandedTemplate(updatedTemplates);
    };

    const handleActionClick = (e, action, template) => {
        e.stopPropagation();
        if (action === "edit") {
            onEdit(template);
        } else if (action === "delete") {
            onDelete(template.template_id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Khuôn mẫu
                            </th>
                            <th className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Loại thiết bị
                            </th>
                            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Người tạo
                            </th>
                            <th className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày tạo
                            </th>
                            <th className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày cập nhật
                            </th>
                            <th className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chi phí sản xuất
                            </th>
                            <th className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tổng giá ước lượng
                            </th>
                            <th className=" py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {templates.map((template) => (
                            <>
                                <tr
                                    key={template.template_id}
                                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${expandedTemplate.includes(template.template_id) ? "bg-blue-50" : ""
                                        }`}
                                    onClick={() => handleTemplateClick(template)}
                                >
                                    <td className="px-2 py-4 whitespace-nowrap">
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
                                    <td className="px-1 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {template.category_name || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-1 py-4 whitespace-nowrap text-sm">
                                        {template.status === "rejected" && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Bị từ chối
                                            </span>
                                        )}
                                        {template.status === "production" && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Sản xuất
                                            </span>
                                        )}
                                        {template.status === "pending" && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Chờ duyệt
                                            </span>
                                        )}
                                        {template.status === "pause" && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-300 text-red-800">
                                                Tạm ngưng
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900">{template.created_name || "N/A"}</td>
                                    <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {template.created_at
                                            ? new Date(template.created_at).toLocaleString('vi-VN', {
                                                timeZone: 'Asia/Ho_Chi_Minh',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })
                                            : 'N/A'}
                                    </td>
                                    <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {template.updated_at
                                            ? new Date(template.updated_at).toLocaleString('vi-VN', {
                                                timeZone: 'Asia/Ho_Chi_Minh',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })
                                            : 'N/A'}
                                    </td>
                                    <td className="px-1 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                        <div className="flex items-center justify-center gap-1">
                                            <input
                                                type="number"
                                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                                value={template.production_cost || 0}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => e.target.value}
                                                min={0}
                                                max={100}
                                                step={1}
                                            />
                                            <span>%</span>
                                        </div>
                                    </td>
                                    <td className="px-1 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                        <div className="flex items-center justify-center gap-1">
                                            {formatCurrency((totalCosts[template.template_id] * (template.production_cost/100 + 1)) || 0)}
                                        </div>
                                    </td>
                                    <td className="px-1 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-center space-x-2">
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
                                {expandedTemplate.includes(template.template_id) && (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-4 bg-gray-50">
                                            <TemplateComponentDetails
                                                components={template.components || []}
                                                template={{ ...template, status:template.status }}
                                                onStatusChange={onChangeStatus}
                                                handleCreateBatch={(template) => console.log("Create batch for", template)}
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
    );
}