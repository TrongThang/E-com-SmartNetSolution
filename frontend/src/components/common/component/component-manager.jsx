"use client"
import { useState } from "react"
import { Plus, Edit, Trash2, Package, Search } from "lucide-react"
import { ComponentFormModal } from "./form-component"
import { formatDate } from "@/utils/format"
import Swal from "sweetalert2"
import axios from "axios"

export default function ComponentManager({ components, setComponents, fetchComponent }) {
    const [showForm, setShowForm] = useState(false)
    const [editingComponent, setEditingComponent] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredComponents = components.filter((component) =>
        component.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleEdit = (component) => {
        setEditingComponent(component)
        setIsEdit(true)
        setShowForm(true)
    }

    const handleAdd = () => {
        setEditingComponent(null)
        setIsEdit(false)
        setShowForm(true)
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingComponent(null)
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const deleteComponent = async (componentId) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Linh kiện sẽ bị xóa khỏi hệ thống!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });
    
        if (result.isConfirmed) {
            try {
                const res = await axios.delete(`http://localhost:3000/api/component/${componentId}`); // nhớ truyền đúng ID
                if (res.data.success === 200) {
                    Swal.fire({
                        title: "Thành công",
                        text: "Linh kiện đã được xóa",
                        icon: "success",
                    });
                    fetchComponent();
                } else {
                    Swal.fire({
                        title: "Lỗi",
                        text: res.error,
                        icon: "error",
                    });
                }
            } catch (error) {
                console.error('Failed to delete component:', error);
            }
        }
    }
    

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Quản lý linh kiện</h2>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
                >
                    <Plus size={20} />
                    <span>Thêm linh kiện</span>
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm linh kiện..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Components Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Linh kiện
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nhà cung cấp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá ước lượng
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
                        {filteredComponents.map((component) => (
                            <tr key={component.component_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                <Package className="h-6 w-6 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{component.name}</div>
                                            <div className="text-sm text-gray-500">ID: {component.component_id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{component.supplier}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatCurrency(component.unit_cost)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(component.created_at)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => handleEdit(component)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit size={25} />
                                        </button>
                                        <button
                                            onClick={() => deleteComponent(component.component_id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Xóa"
                                        >
                                            <Trash2 size={25} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Component Form Modal */}
            {showForm && (
                <ComponentFormModal
                    showForm={showForm}
                    component={editingComponent}
                    onClose={handleCloseForm}
                    isEdit={isEdit}
                    fetchComponent={fetchComponent}
                />
            )}
        </div>
    )
}
