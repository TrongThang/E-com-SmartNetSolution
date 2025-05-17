"use client"

import { useEffect, useState } from "react"
import productApi from "@/apis/modules/product.api.ts"
import { SearchFilters } from "@/components/common/search/SearchFilters"
import { SortOptions } from "@/components/common/search/SortOptions"
import ProductGrid from "@/components/common/product/ProductGrid"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Filter, SlidersHorizontal, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get("keyword") || ""
    const categoryId = searchParams.get("category") || ""
    const [products, setProducts] = useState([])
    const [totalPage, setTotalPage] = useState(1)
    const [page, setPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState({ min: 0, max: 20000000 })
    const [sort, setSort] = useState({ field: "", order: "" })
    const [filterCategories, setFilterCategories] = useState([])
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()


    // Khởi tạo selectedCategories từ URL parameter
    useEffect(() => {
        if (categoryId) {
            setSelectedCategories([parseInt(categoryId)]);
        }
    }, [categoryId]);
    // Chỉ cập nhật filterCategories khi keyword hoặc filter thay đổi
    useEffect(() => {
        const fetchFilterCategories = async () => {
            setIsLoading(true)
            let data = []
            if (keyword.trim()) {
                // Có keyword: lấy sản phẩm theo keyword
                const filters = [
                    {
                        logic: "OR",
                        filters: [
                            { field: "product.name", condition: "contains", value: keyword.trim() },
                            { field: "product.description_normal", condition: "contains", value: keyword.trim() },
                        ],
                    },
                ]
                const params = { page: 1, limit: 1000, filters, logic: "OR" }
                const res = await productApi.search(params)
                data = res.data?.data || []
            } else {
                // Không có keyword: lấy tất cả sản phẩm
                const params = { page: 1, limit: 1000 }
                const res = await productApi.search(params)
                data = res.data?.data || []
            }
            // Lấy unique categories từ data
            const uniqueCategories = []
            const categoryIds = new Set()
            data.forEach((item) => {
                if (item.category_id && !categoryIds.has(item.category_id)) {
                    categoryIds.add(item.category_id)
                    uniqueCategories.push({
                        id: item.category_id,
                        name: item.categories,
                    })
                }
            })
            setFilterCategories(uniqueCategories)
            setIsLoading(false)
        }
        fetchFilterCategories()
    }, [keyword, selectedCategories, priceRange])

    // Build filters cho API lấy sản phẩm
    const buildFilters = () => {
        const keywordFilters = [
            { field: "product.name", condition: "contains", value: keyword.trim() },
            { field: "product.description_normal", condition: "contains", value: keyword.trim() },
        ]
        const otherFilters = []
        if (selectedCategories.length > 0) {
            otherFilters.push({
                field: "product.category_id",
                condition: "in",
                value: selectedCategories,
            })
        }
        if (priceRange.min) {
            otherFilters.push({
                field: "product.selling_price",
                condition: ">=",
                value: priceRange.min,
            })
        }
        if (priceRange.max && priceRange.max < 100000000) {
            otherFilters.push({
                field: "product.selling_price",
                condition: "<=",
                value: priceRange.max,
            })
        }

        // Nếu chỉ có keyword, trả về mảng filter đơn giản (logic OR)
        if (keyword.trim() && otherFilters.length === 0) {
            return {
                logic: "OR",
                filters: keywordFilters,
            }
        }

        // Nếu có thêm filter khác, trả về group filter (logic AND, trong đó có group OR cho keyword)
        const filters = []

        if (categoryId) {
            filters.push({
                field: "product.category_id",
                condition: "=",
                value: parseInt(categoryId)
            })
        }

        if (keyword.trim()) {
            filters.push({
                logic: "OR",
                filters: keywordFilters,
            })
        }
        filters.push(...otherFilters)

        return {
            logic: "AND",
            filters,
        }
    }

    // Lấy sản phẩm theo các điều kiện filter hiện tại
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            const filterGroup = buildFilters()
            const params = {
                page,
                limit: 12,
                filters: filterGroup,
                sort: sort.field,
                order: sort.order,
            }
            const res = await productApi.search(params)
            setProducts(res.data?.data || [])
            setTotalPage(res.data?.total_page || 1)
            setIsLoading(false)
        }
        fetchProducts()
    }, [page, selectedCategories, priceRange, sort, keyword])

    // Xử lý filter/sort
    const handleCategoryChange = (categories) => setSelectedCategories(categories)
    const handlePriceChange = (min, max) => setPriceRange({ min, max })
    const handleSortChange = (sortValue) => {
        if (sortValue === "default") setSort({ field: "", order: "" })
        else {
            const [field, order] = sortValue.split("-")
            setSort({ field, order })
        }
    }
    const handleReset = () => {
        setSelectedCategories([])
        setPriceRange({ min: 0, max: 20000000 })
        setSort({ field: "", order: "" })
        setPage(1)

        if (categoryId) {
            navigate('/search')
        }
    }

    // Đếm số lượng filter đang áp dụng
    const activeFilterCount = () => {
        let count = 0
        if (selectedCategories.length > 0) count++
        if (priceRange.min > 0 || priceRange.max < 20000000) count++
        return count
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-6 pt-28">
                {/* Search header */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Kết quả tìm kiếm</h1>
                            {keyword && (
                                <p className="text-gray-500 mt-1">
                                    Từ khóa: <span className="font-medium text-blue-600">"{keyword}"</span>
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="md:hidden flex items-center gap-2"
                                onClick={() => setShowMobileFilters(true)}
                            >
                                <Filter className="h-4 w-4" />
                                <span>Lọc</span>
                                {activeFilterCount() > 0 && (
                                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {activeFilterCount()}
                                    </span>
                                )}
                            </Button>
                            <SortOptions onSortChange={handleSortChange} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Mobile filter overlay */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
                            <div className="absolute right-0 top-0 h-full w-[80%] max-w-md bg-white shadow-xl p-4 overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold flex items-center">
                                        <SlidersHorizontal className="h-5 w-5 mr-2" />
                                        Bộ lọc
                                    </h3>
                                    <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                                <SearchFilters
                                    categories={filterCategories}
                                    onCategoryChange={handleCategoryChange}
                                    onPriceChange={handlePriceChange}
                                    onReset={handleReset}
                                    selectedCategories={selectedCategories}
                                    priceRange={priceRange}
                                />
                                <div className="mt-6 flex gap-3">
                                    <Button className="w-full" onClick={() => setShowMobileFilters(false)}>
                                        Áp dụng
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            handleReset()
                                            setShowMobileFilters(false)
                                        }}
                                    >
                                        Đặt lại
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Desktop filters */}
                    <div className="hidden md:block md:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-28">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center">
                                    <SlidersHorizontal className="h-5 w-5 mr-2" />
                                    Bộ lọc
                                </h3>
                                {activeFilterCount() > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleReset}
                                        className="text-blue-500 hover:text-blue-700 text-xs"
                                    >
                                        Đặt lại
                                    </Button>
                                )}
                            </div>
                            <SearchFilters
                                categories={filterCategories}
                                onCategoryChange={handleCategoryChange}
                                onPriceChange={handlePriceChange}
                                onReset={handleReset}
                                selectedCategories={selectedCategories}
                                priceRange={priceRange}
                            />
                        </div>
                    </div>

                    {/* Products */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-800">
                                    {isLoading ? (
                                        <span className="animate-pulse">Đang tải...</span>
                                    ) : (
                                        <>
                                            Tìm thấy <span className="text-blue-600 font-bold">{products.length}</span> sản phẩm
                                        </>
                                    )}
                                </h3>
                                {selectedCategories.length > 0 && (
                                    <div className="hidden md:flex items-center gap-2 flex-wrap">
                                        <span className="text-sm text-gray-500">Danh mục:</span>
                                        {selectedCategories.map((catId) => {
                                            const category = filterCategories.find((c) => c.id === catId)
                                            return category ? (
                                                <span
                                                    key={catId}
                                                    className="inline-flex items-center bg-blue-50 text-blue-700 text-xs rounded-full px-3 py-1"
                                                >
                                                    {category.name}
                                                    <button
                                                        className="ml-1 text-blue-500 hover:text-blue-700"
                                                        onClick={() => handleCategoryChange(selectedCategories.filter((id) => id !== catId))}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ) : null
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-80">
                                        <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
                                        <div className="bg-gray-200 h-4 rounded-md mb-2 w-3/4"></div>
                                        <div className="bg-gray-200 h-4 rounded-md mb-4 w-1/2"></div>
                                        <div className="bg-gray-200 h-6 rounded-md w-1/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <ProductGrid products={products} />
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Search className="h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                                        Không tìm thấy sản phẩm phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với từ khóa khác
                                        hoặc điều chỉnh bộ lọc.
                                    </p>
                                    <Button onClick={handleReset}>Đặt lại bộ lọc</Button>
                                </div>
                            </div>
                        )}

                        {/* {totalPage > 1 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPage}
                                    onPageChange={setPage}
                                />
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    )
}
