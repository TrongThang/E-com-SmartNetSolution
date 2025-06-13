import { Button } from "@/components/ui/button"
import { Package, Truck, Hash, User, X, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function TemplateComponentDetails({ components, template, onStatusChange }) {
    const [statusTemplate, setStatusTemplate] = useState(template.status)

    const statusOptions = [
        { value: "production", label: "Sản xuất" },
        { value: "pause", label: "Tạm ngưng" },
    ]

    const statusActions = {
        production: {
            title: "Bạn có chắc chắn đưa vào sản xuất thiết bị?",
            text: "Thiết bị sẽ chuyển sang sản xuất!",
            icon: "question",
            confirmText: "Xác nhận",
        },
        rejected: {
            title: "Bạn có chắc muốn từ chối thiết bị?",
            text: "Thiết bị sẽ chuyển sang bị từ chối",
            icon: "question",
            confirmText: "Từ chối",
        },
        pause: {
            title: "Bạn có chắc muốn chuyển tạm ngừng sản xuất thiết bị?",
            text: "Thiết bị sẽ chuyển sang tạm ngưng",
            icon: "warning",
            confirmText: "Tạm ngưng",
        }
    };

    const handleStatusChange = async (template_id, status) => {
        const action = statusActions[status];
        if (!action) return; // nếu status không có trong danh sách, thì không làm gì

        const result = await Swal.fire({
            title: action.title,
            text: action.text,
            icon: action.icon,
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: action.confirmText,
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            if (onStatusChange) {
                const updatedTemplate = {
                    template_id: template_id,
                    status: status,
                };
                onStatusChange(updatedTemplate);
            }
            setStatusTemplate(status);
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const totalCost = components.reduce(
        (sum, component) =>
            sum + (component.quantity_required || 0) * (component.unit_cost || 0),
        0
    );

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết linh kiện - {template.name}</h3>
                <div className="text-sm text-gray-500">Tổng: {components.length} linh kiện</div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Package className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">Tổng linh kiện</p>
                            <p className="text-2xl font-bold text-blue-600">{components.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Hash className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-900">Tổng số lượng</p>
                            <p className="text-2xl font-bold text-green-600">
                                {components.reduce((sum, c) => sum + c.quantity_required, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Components Table */}
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Linh kiện
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nhà cung cấp
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số lượng cần
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Đơn giá ước lượng
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thành tiền ước lượng
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {components.map((component, index) => (
                            <tr key={component.component_id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <Package className="h-5 w-5 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{component.name}</div>
                                            <div className="text-sm text-gray-500">ID: {component.component_id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Truck className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-900">{component.supplier}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {Number(component.status) === 0 && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Hết hàng
                                        </span>
                                    )}
                                    {Number(component.status) === 1 && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Còn hàng
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {component.quantity_required}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                    {formatCurrency(component.unit_cost)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                    {formatCurrency(component.quantity_required * component.unit_cost)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                        <tr>
                            <td colSpan="5" className="px-0 py-3 text-right text-sm font-medium text-gray-900">
                                Giá sản phẩm ước lượng:
                            </td>
                            <td className="px-6 py-3 text-right text-lg font-bold text-blue-600">{formatCurrency(totalCost)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            {(template.status === "production" || template.status === "pause") && (
                <div className="mt-4 flex justify-end space-x-3">
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={statusTemplate}
                        onChange={(e) => handleStatusChange(template.template_id, e.target.value)}
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {(template.status === "pending") && (
                <div className="mt-4 flex justify-end space-x-3">
                    <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleStatusChange(template.template_id, "rejected")}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Từ chối
                    </Button>
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => { handleStatusChange(template.template_id, "production") }}
                    >
                        <User className="w-4 h-4 mr-2" />
                        Duyệt
                    </Button>
                </div>

            )}

        </div>
    )
}