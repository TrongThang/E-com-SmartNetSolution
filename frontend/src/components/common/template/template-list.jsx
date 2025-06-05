"use client";
import { ChevronDown, ChevronUp, Edit, Package, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import TemplateComponentDetails from "./template-component-details";

export default function TemplateList({ templates, onEdit, onDelete, onChangeStatus, handleCostChange }) {
    const [expandedTemplate, setExpandedTemplate] = useState([]);
    const [totalCosts, setTotalCosts] = useState({});
    const [tempCosts, setTempCosts] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: "template_id", direction: "asc" });

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

    // Xử lý khi người dùng thay đổi giá trị input (lưu tạm thời)
    const handleInputChange = (templateId, value) => {
        setTempCosts((prev) => ({
            ...prev,
            [templateId]: value,
        }));
    };

    // Xử lý khi input mất focus (gửi giá trị đến handleCostChange)
    const handleInputBlur = (template, value) => {
        const parsedValue = parseFloat(value) || 0;
        if (parsedValue >= 0 && parsedValue <= 100) {
            const updatedTemplate = {
                ...template,
                production_cost: parsedValue,
            };
            handleCostChange(updatedTemplate);
        }
    };

    // Hàm xử lý sắp xếp
    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            if (prevConfig.key === key) {
                return {
                    key,
                    direction: prevConfig.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    };

    // Hàm sắp xếp templates
    const sortedTemplates = [...templates].sort((a, b) => {
        const { key, direction } = sortConfig;
        let aValue = a[key];
        let bValue = b[key];

        // Xử lý trường hợp name và category_name
        if (key === "name" || key === "category_name") {
            // Xử lý null, undefined hoặc "N/A"
            if (aValue == null || aValue === "N/A") aValue = "\uffff"; // Đẩy xuống cuối
            if (bValue == null || bValue === "N/A") bValue = "\uffff";

            // Chuyển thành chữ thường và so sánh theo tiếng Việt
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();

            // Sử dụng localeCompare để sắp xếp đúng tiếng Việt
            const compareResult = aValue.localeCompare(bValue, "vi", { sensitivity: "base" });
            return direction === "asc" ? compareResult : -compareResult;
        }

        // Xử lý trường hợp totalCosts
        if (key === "total_cost") {
            aValue = (totalCosts[a.template_id] * (a.production_cost / 100 + 1)) || 0;
            bValue = (totalCosts[b.template_id] * (b.production_cost / 100 + 1)) || 0;
        }

        // Xử lý trường hợp ngày
        if (key === "created_at" || key === "updated_at") {
            aValue = a[key] ? new Date(a[key]).getTime() : 0;
            bValue = b[key] ? new Date(b[key]).getTime() : 0;
        }

        // Xử lý trường hợp status
        if (key === "status") {
            const statusOrder = { production: 1, pending: 2, pause: 3, rejected: 4 };
            aValue = statusOrder[a[key]] || 5;
            bValue = statusOrder[b[key]] || 5;
        }

        // Xử lý trường hợp null hoặc undefined cho các trường khác
        if (aValue == null) aValue = "";
        if (bValue == null) bValue = "";

        // So sánh
        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("name")}
                            >
                                Khuôn mẫu
                                {sortConfig.key === "name" &&
                                    (sortConfig.direction === "asc" ? (
                                        <ChevronUp className="inline ml-1 h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="inline ml-1 h-4 w-4" />
                                    ))}
                            </th>
                            <th
                                className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("category_name")}
                            >
                                Loại thiết bị
                                {sortConfig.key === "category_name" &&
                                    (sortConfig.direction === "asc" ? (
                                        <ChevronUp className="inline ml-1 h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="inline ml-1 h-4 w-4" />
                                    ))}
                            </th>
                            <th
                                className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("status")}
                            >
                                Trạng thái
                                {sortConfig.key === "status" &&
                                    (sortConfig.direction === "asc" ? (
                                        <ChevronUp className="inline ml-1 h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="inline ml-1 h-4 w-4" />
                                    ))}
                            </th>
                            <th
                                className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("created_name")}
                            >
                                Người tạo
                                {sortConfig.key === "created_name" &&
                                    (sortConfig.direction === "asc" ? (
                                        <ChevronUp className="inline ml-1 h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="inline ml-1 h-4 w-4" />
                                    ))}
                            </th>
                            <th
                                className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("created_at")}
                            >
                                Ngày tạo
                                {sortConfig.key === "created_at" &&
                                    (sortConfig.direction === "asc" ? (
                                        <ChevronUp className="inline ml-1 h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="inline ml-1 h-4 w-4" />
                                    ))}
                            </th>
                            <th
                                className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("updated_at")}
                            >
                                Ngày cập nhật
                                {sortConfig.key === "updated_at" &&
                                    (sortConfig.direction === "asc" ? (
                                        <ChevronUp className="inline ml-1 h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="inline ml-1 h-4 w-4" />
                                    ))}
                            </th>
                            <th
                                className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("production_cost")}
                            >
                                Chi phí sản xuất
                                {sortConfig.key === "production_cost" &&
                                    (sortConfig.direction === "asc" ? (
                                        <ChevronUp className="inline ml-1 h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="inline ml-1 h-4 w-4" />
                                    ))}
                            </th>
                            <th
                                className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort("total_cost")}
                            >
                                Tổng giá ước lượng
                                {sortConfig.key === "total_cost" &&
                                    (sortConfig.direction === "asc" ? (
                                        <ChevronUp className="inline ml-1 h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="inline ml-1 h-4 w-4" />
                                    ))}
                            </th>
                            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedTemplates.map((template) => (
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
                                                value={tempCosts[template.template_id] ?? template.production_cost ?? 0}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => handleInputChange(template.template_id, e.target.value)}
                                                onBlur={(e) => handleInputBlur(template, e.target.value)}
                                                min={0}
                                                max={100}
                                                step={1}
                                            />
                                            <span>%</span>
                                        </div>
                                    </td>
                                    <td className="px-1 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                        <div className="flex items-center justify-center gap-1">
                                            {formatCurrency((totalCosts[template.template_id] * (template.production_cost / 100 + 1)) || 0)}
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
                                                template={{ ...template, status: template.status }}
                                                onStatusChange={onChangeStatus}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            {sortedTemplates.length === 0 && (
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Không có template nào</h3>
                    <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo template đầu tiên.</p>
                </div>
            )}
        </div>
    );
}