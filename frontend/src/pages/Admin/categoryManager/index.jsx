"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, Plus, Search, Folder } from "lucide-react"
import { Input } from "@/components/ui/input"
import categoryApi from "@/apis/modules/categories.api.ts"
import { useNavigate } from "react-router-dom"
import ActionsColumn from "@/components/common/table_e/ActionsColumn"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination"
import Swal from "sweetalert2"

export default function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("info")
  const [filteredCategories, setFilteredCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5) // Number of top-level categories per page
  const navigate = useNavigate()

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await categoryApi.list({})
      if (res.status_code === 200) {
        setCategories(res.data?.categories || [])
      } else {
        setError("Có lỗi xảy ra khi tải danh mục")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Có lỗi xảy ra khi tải danh mục")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories)
      setCurrentPage(1) // Reset to first page when search term is cleared
      return
    }

    const searchInCategory = (category) => {
      const matches = category.name.toLowerCase().includes(searchTerm.toLowerCase())
      const childrenMatches = category.children?.map(child => searchInCategory(child)) || []
      return matches || childrenMatches.some(match => match)
    }

    const filtered = categories.filter(category => searchInCategory(category))
    setFilteredCategories(filtered)
    setCurrentPage(1) // Reset to first page when search term changes

    // Automatically expand parent categories containing search results
    const expandParentCategories = (category) => {
      if (category.children?.some(child => searchInCategory(child))) {
        setExpandedCategories(prev => [...new Set([...prev, category.category_id])])
        category.children.forEach(expandParentCategories)
      }
    }

    filtered.forEach(expandParentCategories)
  }, [searchTerm, categories])

  // Get top-level categories (parent_id === null) for pagination
  const getTopLevelCategories = (categoryList) => {
    return categoryList.filter(cat => !cat.parent_id)
  }

  // Pagination logic
  const topLevelCategories = getTopLevelCategories(filteredCategories)
  const totalPages = Math.ceil(topLevelCategories.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCategories = topLevelCategories.slice(indexOfFirstItem, indexOfLastItem)

  const toggleCategory = (categoryId) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId))
    } else {
      setExpandedCategories([...expandedCategories, categoryId])
    }
  }

  const selectCategory = (category) => {
    setSelectedCategory(category)
  }

  const handleAddCategory = () => {
    navigate("/admin/categories/create")
  }

  const handleEditCategory = (category) => {
    navigate(`/admin/categories/edit/${category.category_id}`)
  }

  const handleDeleteCategory = async (category) => {
    Swal.fire({
      icon: "warning",
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`,
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await categoryApi.delete(category.category_id)
          if (res.status_code === 200) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: `Đã xóa danh mục "${category.name}"`,
              confirmButtonText: "OK",
              timer: 2000, // Auto-close after 2 seconds
            })
            fetchCategories() // Refresh the list
            setSelectedCategory(null) // Reset selected category
            setCurrentPage(1) // Reset to first page after deletion
          } else {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: res.message || "Có lỗi xảy ra khi xóa danh mục",
              confirmButtonText: "Đóng",
            })
          }
        } catch (error) {
          console.error("Error deleting category:", error)
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: error.response?.data?.message || "Có lỗi xảy ra khi xóa danh mục",
            confirmButtonText: "Đóng",
          })
        }
      }
    })
  }

  // Recursive function to render category tree with hidden status
  const renderCategoryTree = (categoryList, parentId = null, level = 0) => {
    return categoryList
      .filter(cat => cat.parent_id === parentId)
      .map(category => (
        <div key={category.category_id}>
          <div className="flex items-start">
            <div
              className={`flex items-center py-1 px-2 rounded-md flex-1 cursor-pointer hover:bg-gray-50 ${selectedCategory?.category_id === category.category_id ? "bg-gray-100" : ""}`}
              onClick={() => {
                selectCategory(category)
                if (category.children?.length > 0) {
                  toggleCategory(category.category_id)
                }
              }}
            >
              <Folder size={16} className="mr-2 text-yellow-500" />
              <span className="text-sm flex-1">
                {category.name}
                {searchTerm && category.name.toLowerCase().includes(searchTerm.toLowerCase()) && (
                  <span className="ml-1 text-xs text-blue-500">(match)</span>
                )}
                {category.is_hide && (
                  <span className="ml-2 text-xs text-gray-500 italic ">(Không hoạt động)</span>
                )}
              </span>
              {category.children?.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleCategory(category.category_id)
                  }}
                  className={`p-1 transition-transform duration-200 ${expandedCategories.includes(category.category_id) ? "rotate-90" : ""}`}
                >
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

          {expandedCategories.includes(category.category_id) && category.children?.length > 0 && (
            <div className="ml-6">
              {renderCategoryTree(category.children, category.category_id, level + 1)}
            </div>
          )}
        </div>
      ))
  }

  // Pagination navigation
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Generate page numbers for display with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Show up to 5 page numbers at a time
    const halfPagesToShow = Math.floor(maxPagesToShow / 2)

    let startPage = Math.max(1, currentPage - halfPagesToShow)
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    if (startPage > 1) {
      pageNumbers.push(1)
      if (startPage > 2) pageNumbers.push("...")
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push("...")
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Quản lý danh mục</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="border rounded-md shadow-sm">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Danh mục</h2>
              <Button
                onClick={handleAddCategory}
                className="px-6 bg-blue-600 text-white hover:opacity-70 flex items-center gap-2"
              >
                <Plus size={16} /> Thêm danh mục
              </Button>
            </div>

            <div className="mt-4 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="p-2">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4">{error}</div>
            ) : (
              <div className="space-y-1">
                {renderCategoryTree(currentCategories)}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && !error && topLevelCategories.length > itemsPerPage && (
            <Pagination className="justify-start ms-5 mt-4 mb-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </PaginationLink>
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* Right column - Category details and table */}
        <div className="md:col-span-2 space-y-6">
          {/* Category details */}
          {selectedCategory && (
            <>
              <div className="space-y-6 border shadow-sm rounded-lg">
                {/* Chi tiết danh mục */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Chi tiết danh mục</h2>
                      <p className="text-sm text-gray-500">Thông tin chi tiết về danh mục đã chọn</p>
                    </div>
                    <ActionsColumn
                      row={selectedCategory}
                      onEdit={handleEditCategory}
                      onDelete={handleDeleteCategory}
                    />
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        onClick={() => setActiveTab("info")}
                        className={`border-b-2 ${activeTab === "info"
                          ? "border-black text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          } text-sm font-medium py-4`}
                      >
                        Thông tin chung
                      </button>
                      <button
                        onClick={() => setActiveTab("attributes")}
                        className={`border-b-2 ${activeTab === "attributes"
                          ? "border-black text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          } text-sm font-medium py-4`}
                      >
                        Nhóm thuộc tính
                      </button>
                      <button
                        onClick={() => setActiveTab("subcategories")}
                        className={`border-b-2 ${activeTab === "subcategories"
                          ? "border-black text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          } text-sm font-medium py-4`}
                      >
                        Danh mục con
                      </button>
                    </nav>
                  </div>

                  {/* Tab content */}
                  {activeTab === "info" ? (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
                      <div>
                        <span className="text-gray-500">Tên danh mục:</span>
                        <div className="font-medium">
                          {selectedCategory.name}
                          {selectedCategory.is_hide && (
                            <span className="ml-2 text-xs text-gray-500 italic">(Không hoạt động)</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Danh mục cha:</span>
                        <div>
                          {selectedCategory.parent_id
                            ? categories.find(c => c.category_id === selectedCategory.parent_id)?.name
                            : "Không có"}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Slug:</span>
                        <div>{selectedCategory.slug}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Trạng thái:</span>
                        <div>{selectedCategory.is_hide ? "Không hoạt động" : "Hoạt động"}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Ngày tạo:</span>
                        <div>
                          {selectedCategory.created_at
                            ? new Date(selectedCategory.created_at).toLocaleString("vi-VN")
                            : "Chưa có"}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Ngày cập nhật:</span>
                        <div>
                          {selectedCategory.updated_at
                            ? new Date(selectedCategory.updated_at).toLocaleString("vi-VN")
                            : "Chưa cập nhật"}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Mô tả:</span>
                        <div>{selectedCategory.description || "Chưa có mô tả"}</div>
                      </div>
                    </div>
                  ) : activeTab === "attributes" ? (
                    <div className="space-y-4">
                      {selectedCategory.attribute_groups && selectedCategory.attribute_groups.length > 0 ? (
                        selectedCategory.attribute_groups.map(group => (
                          <div key={group.group_id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium text-gray-900">{group.group_name}</h3>
                              <span className="text-xs text-gray-500">
                                {group.attributes.length} thuộc tính
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.attributes.map(attr => (
                                <span
                                  key={attr.attribute_id}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {attr.attribute_name}
                                  {attr.required && (
                                    <span className="ml-1 text-red-500">*</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          Chưa có nhóm thuộc tính nào được gán cho danh mục này
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedCategory.children && selectedCategory.children.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedCategory.children.map(child => (
                            <div
                              key={child.category_id}
                              className="bg-gray-50 px-6 py-2 me-7 rounded-lg"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="text-sm text-gray-900">
                                    {child.name}
                                    {child.is_hide && (
                                      <span className="ml-2 text-xs text-gray-500 italic">(Không hoạt động)</span>
                                    )}
                                  </h3>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {child.children?.length || 0} danh mục con
                                  </p>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {child.is_hide ? "Không hoạt động" : "Hoạt động"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          Chưa có danh mục con nào
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
