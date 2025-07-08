"use client"

import { useState, useEffect } from "react"
import { X, Search, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import Swal from "sweetalert2"
import attributeGroupApi from "@/apis/modules/attribute_group.api.ts"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination"

const PAGE_SIZE = 8

const AttributeGroupCardList = ({ onEdit }) => {
  const [attributeGroups, setAttributeGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)

  const fetchAttributeGroups = async () => {
    setLoading(true)
    try {
      const res = await attributeGroupApi.list({})
      setAttributeGroups(res.data || [])
    } catch (err) {
      // handle error nếu cần
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttributeGroups()
  }, [])

  // Khi gọi onEdit, truyền thêm hàm reload
  const handleEdit = (group) => {
    onEdit?.(group, fetchAttributeGroups) // truyền callback reload
  }

  const handleViewMore = (group) => {
    setSelectedGroup(group)
    setSearchTerm("")
  }

  const closeModal = () => {
    setSelectedGroup(null)
  }
  const handleDeleteOrRestoreGroup = async (group, isRestore = false) => {
    const confirm = await Swal.fire({
      title: isRestore ? "Khôi phục nhóm thuộc tính?" : "Bạn có chắc muốn xóa nhóm thuộc tính này?",
      text: isRestore ? "Nhóm thuộc tính sẽ được khôi phục." : "Thao tác này không thể hoàn tác!",
      icon: isRestore ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: isRestore ? "Khôi phục" : "Xóa",
      cancelButtonText: "Hủy",
    })
    if (confirm.isConfirmed) {
      try {
        const res = await attributeGroupApi.deleted(group.id, isRestore)
        if (res.status_code === 200) {
          Swal.fire(
            isRestore ? "Đã khôi phục!" : "Đã xóa!",
            isRestore ? "Nhóm thuộc tính đã được khôi phục." : "Nhóm thuộc tính đã được xóa.",
            "success",
          )
          fetchAttributeGroups()
        } else {
          Swal.fire("Lỗi", res.errors?.[0]?.message || (isRestore ? "Khôi phục thất bại" : "Xóa thất bại"), "error")
        }
      } catch (err) {
        Swal.fire("Lỗi", "Có lỗi xảy ra, vui lòng thử lại.", "error")
      }
    }
  }

  // Tìm kiếm và phân trang
  const filteredGroups = attributeGroups.filter((group) => group.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  const totalPage = Math.ceil(filteredGroups.length / PAGE_SIZE)
  const pagedGroups = filteredGroups.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Hàm tạo mảng các trang để hiển thị
  const getPageNumbers = () => {
    const pages = []
    if (totalPage <= 3) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (page > 2) {
        pages.push("...")
      }
      if (page !== 1 && page !== totalPage) {
        pages.push(page)
      }
      if (page < totalPage - 1) {
        pages.push("...")
      }
      pages.push(totalPage)
    }
    return pages
  }

  return (
    <div className="relative">
      {/* Search */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhóm thuộc tính"
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-md"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </div>
      {/* Loading */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pagedGroups.map((group) => (
              <AttributeGroupCard
                key={group.id}
                group={group}
                onEdit={handleEdit}
                onDelete={handleDeleteOrRestoreGroup}
                onViewMore={() => handleViewMore(group)}
              />
            ))}
            {pagedGroups.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-8">Không có dữ liệu</div>
            )}
          </div>
          {/* Pagination */}
          {totalPage > 1 && (
            <div className="mt-8">
              <Pagination className="justify-start">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage(page - 1)}
                      className={`transition-colors cursor-pointer hover:bg-gray-100 ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                  {getPageNumbers().map((pageNum, index) => (
                    <PaginationItem key={index}>
                      {pageNum === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                          className="transition-colors hover:bg-gray-100"
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage(page + 1)}
                      className={`transition-colors hover:bg-gray-100 ${page === totalPage ? "pointer-events-none opacity-50" : ""}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Attributes Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full shadow-lg flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-medium text-sm">Thuộc tính của {selectedGroup.name}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            {/* Total count */}
            <div className="px-4 py-2 text-xs text-gray-600">Tổng số: {selectedGroup.attributes.length} thuộc tính</div>

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
                    .filter((attr) => attr.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((attr, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-2 px-2">
                          {attr.name}
                          {attr.required && <span className="text-xs text-gray-500"> - bắt buộc</span>}
                        </td>
                        <td className="py-2 px-2">{attr.datatype}</td>
                        <td className="py-2 px-2">{idx % 3 === 0 ? "Ẩn" : "Hiển thị"}</td>
                      </tr>
                    ))}
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
          <button className="text-gray-600 hover:text-blue-600 transition-colors p-1" onClick={() => onEdit?.(group)}>
            <Pencil size={16} />
          </button>
          {group.is_deleted ? (
            <button
              className="text-gray-600 hover:text-green-600 transition-colors p-1"
              onClick={() => onDelete?.(group, true)}
            >
              Khôi phục
            </button>
          ) : (
            <button
              className="text-gray-600 hover:text-red-600 transition-colors p-1"
              onClick={() => onDelete?.(group, false)}
            >
              <Trash2 size={16} />
            </button>
          )}
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
