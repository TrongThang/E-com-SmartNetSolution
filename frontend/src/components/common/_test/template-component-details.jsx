"use client"
import { Package, Truck, DollarSign, Hash, PackagePlus } from "lucide-react"

export default function TemplateComponentDetails({ components, templateName }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const totalCost = components.reduce((sum, component) => sum + component.quantity_required * component.unit_cost, 0)

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết linh kiện - {templateName}</h3>
                <div className="text-sm text-gray-500">Tổng: {components.length} linh kiện</div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

                <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <DollarSign className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-purple-900">Tổng chi phí</p>
                            <p className="text-lg font-bold text-purple-600">{formatCurrency(totalCost)}</p>
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
                                Số lượng cần
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Đơn giá
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thành tiền
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
                                                <Package className="h-5 w-5 text-blue-600" />
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
                            <td colSpan="4" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                Tổng cộng:
                            </td>
                            <td className="px-6 py-3 text-right text-lg font-bold text-blue-600">{formatCurrency(totalCost)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Additional Actions */}
            <div className="mt-4 flex justify-end space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Package className="h-4 w-4 mr-2" />
                    Xuất danh sách
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <PackagePlus className="h-4 w-4 mr-2" />
                    Tạo đơn yêu cầu sản xuất
                </button>
            </div>
        </div>
    )
}
