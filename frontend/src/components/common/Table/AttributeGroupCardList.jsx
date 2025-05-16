"use client"

import { useState } from "react"
import { X, Search, Trash2, Pencil } from 'lucide-react'

const AttributeGroupCardList = ({ attributeGroups, onEdit, onDelete }) => {
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    const handleViewMore = (group) => {
        setSelectedGroup(group)
        setSearchTerm("")
    }

    const closeModal = () => {
        setSelectedGroup(null)
    }
    const handleDeleteGroup = async () => {
        const confirm = await Swal.fire({
            title: "Bạn có chắc muốn xóa nhóm thuộc tính này?",
            text: "Thao tác này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy"
        });
        if (confirm.isConfirmed) {
            try {
                const res = await attributeGroupApi.deleted(attributeGroup.id);
                if (res.status_code === 200) {
                    Swal.fire("Đã xóa!", "Nhóm thuộc tính đã được xóa.", "success");
                    onClose();
                } else {
                    Swal.fire("Lỗi", res.errors?.[0]?.message || "Xóa thất bại", "error");
                }
            } catch (err) {
                Swal.fire("Lỗi", "Có lỗi xảy ra, vui lòng thử lại.", "error");
            }
        }
    };

    return (
        <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {attributeGroups.map((group) => (
                    <AttributeGroupCard
                        key={group.id}
                        group={group}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onViewMore={() => handleViewMore(group)}
                    />
                ))}
            </div>

            {/* Attributes Modal */}
            {selectedGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
                    <div className="bg-white w-full max-w-md h-full shadow-lg flex flex-col">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h3 className="font-medium text-sm">Thuộc tính của {selectedGroup.name}</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Total count */}
                        <div className="px-4 py-2 text-xs text-gray-600">
                            Tổng số: {selectedGroup.attributes.length} thuộc tính
                        </div>

                        {/* Search */}
                        <div className="px-4 py-2">
                            <div className="relative">
                                <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm thuộc tính"
                                    className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-md"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Attributes Table */}
                        <div className="flex-1 overflow-auto px-4">
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="text-left py-2 px-2 font-medium text-gray-600">Tên thuộc tính</th>
                                        <th className="text-left py-2 px-2 font-medium text-gray-600">Kiểu dữ liệu</th>
                                        <th className="text-left py-2 px-2 font-medium text-gray-600">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {selectedGroup.attributes
                                        .filter(attr =>
                                            attr.name.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((attr, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="py-2 px-2">
                                                    {attr.name}
                                                    {attr.required && <span className="text-xs text-gray-500"> - bắt buộc</span>}
                                                </td>
                                                <td className="py-2 px-2">{attr.datatype}</td>
                                                <td className="py-2 px-2">
                                                    {idx % 3 === 0 ? "Ẩn" : "Hiển thị"}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const AttributeGroupCard = ({ group, onEdit, onDelete, onViewMore }) => {
    const [showAll, setShowAll] = useState(false)
    const attributesToShow = showAll ? group.attributes : group.attributes.slice(0, 2)
    const remaining = group.attributes.length - 2

    // Giả sử group có created_at, updated_at dạng ISO string
    const formatDate = (dateStr) => {
        if (!dateStr) return ""
        const d = new Date(dateStr)
        return d.toLocaleDateString("vi-VN")
    }

    return (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow transition-shadow duration-200">
            {/* Header with title and actions */}
            <div className="flex justify-between items-center p-2.5 border-b border-gray-200">
                <div className="font-medium text-sm">{group.name || "Thông số kỹ thuật"}</div>
                <div className="flex gap-3">
                    <button
                        className="text-gray-600 hover:text-blue-600 transition-colors p-1"
                        onClick={() => onEdit?.(group)}
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        className="text-gray-600 hover:text-red-600 transition-colors p-1"
                        onClick={() => onDelete?.(group)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Dates */}
            <div className="px-2.5 py-1.5 text-xs text-gray-500 border-b border-gray-200 bg-gray-50">
                <div className=" ">
                    <span>Ngày tạo:</span>
                    <span className="font-medium"> {formatDate(group.created_at)}</span>
                </div>
                <div className=" mt-0.5">
                    <span>Cập nhật:</span>
                    <span className="font-medium"> {formatDate(group.updated_at)}</span>
                </div>
            </div>

            {/* Attributes header */}
            <div className="flex justify-between items-center px-2.5 py-1.5 border-b border-gray-200">
                <div className="font-medium text-xs">Thuộc tính:</div>
                <div className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">Số lượng: {group.attributes.length}</div>
            </div>

            {/* Attributes list */}
            <div className="divide-y divide-gray-100">
                {attributesToShow.map((attr, idx) => (
                    <div key={idx} className="px-2.5 py-2 hover:bg-gray-50 transition-colors">
                        <div className="text-xs font-medium">{attr.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                            {attr.datatype} {attr.required ? "- bắt buộc" : ""}
                        </div>
                    </div>
                ))}
            </div>

            {/* View more button */}
            {remaining > 0 && (
                <div className="p-2 text-center border-t border-gray-200">
                    <button
                        className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors"
                        onClick={onViewMore}
                    >
                        Xem thêm {remaining} thuộc tính
                    </button>
                </div>
            )}
        </div>
    )
}

export default AttributeGroupCardList
