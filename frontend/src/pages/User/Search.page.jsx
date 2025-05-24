"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import productApi from "@/apis/modules/product.api.ts"
import categoryApi from "@/apis/modules/categories.api.ts"
import { SearchFilters } from "@/components/common/search/SearchFilters"
import { SortOptions } from "@/components/common/search/SortOptions"
import ProductGrid from "@/components/common/product/ProductGrid"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Filter, SlidersHorizontal, Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination"

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get("keyword") || ""
    const categoryParam = searchParams.get("category") || ""
    const pageParam = searchParams.get("page") || "1"
    const [products, setProducts] = useState([])
    const [totalPage, setTotalPage] = useState(1)
    const [page, setPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState({ min: 0, max: 20000000 })
    const [sort, setSort] = useState({ field: "", order: "" })
    const [filterCategories, setFilterCategories] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    // Memoize getAllChildIds to optimize performance
    const getAllChildIds = useMemo(() => {
        const cache = {}
        return (categoryId, categories) => {
            if (cache[categoryId]) return cache[categoryId]
            let ids = [categoryId]
            const children = categories.filter(cat => cat.parent_id === categoryId)
            for (const child of children) {
                ids = ids.concat(getAllChildIds(child.category_id, categories))
            }
            cache[categoryId] = [...new Set(ids)]
            return cache[categoryId]
        }
    }, [allCategories])

    // Build filters for product API
    const buildFilters = useCallback(() => {
        const filters = []

        if (keyword.trim()) {
            filters.push({
                logic: "OR",
                filters: [
                    { field: "product.name", condition: "contains", value: keyword.trim() }
                ]
            })
        }

        if (selectedCategories.length > 0) {
            let allCategoryIds = []
            selectedCategories.forEach(id => {
                allCategoryIds = allCategoryIds.concat(getAllChildIds(id, allCategories))
            })
            allCategoryIds = [...new Set(allCategoryIds)]

            if (allCategoryIds.length > 0) {
                filters.push({
                    field: "product.category_id",
                    condition: "in",
                    value: allCategoryIds
                })
            }
        }

        if (priceRange.min > 0) {
            filters.push({
                field: "product.selling_price",
                condition: ">=",
                value: priceRange.min
            })
        }
        if (priceRange.max && priceRange.max < 100000000) {
            filters.push({
                field: "product.selling_price",
                condition: "<=",
                value: priceRange.max
            })
        }

        console.log("Filters sent to API:", JSON.stringify(filters, null, 2))

        return filters.length === 0 ? null : filters.length === 1 ? filters[0] : { logic: "AND", filters }
    }, [keyword, selectedCategories, priceRange, allCategories])

    // Initialize page and selectedCategories from URL
    useEffect(() => {
        console.log("Initializing from URL:", { pageParam, categoryParam })
        // Handle page parameter
        const parsedPage = parseInt(pageParam)
        const validPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage
        setPage(validPage)

        // Handle category parameter
        if (categoryParam) {
            try {
                const categories = categoryParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
                setSelectedCategories(categories)
            } catch (error) {
                console.error("Lỗi khi phân tích tham số danh mục:", error)
                setSelectedCategories([])
            }
        } else {
            setSelectedCategories([])
        }
    }, [pageParam, categoryParam])

    // Sync URL when page or filters change
    useEffect(() => {
        const newSearchParams = new URLSearchParams()
        if (keyword) {
            newSearchParams.set("keyword", keyword)
        }
        if (selectedCategories.length > 0) {
            newSearchParams.set("category", selectedCategories.join(","))
        }
        if (page > 1) {
            newSearchParams.set("page", page.toString())
        }
        const newUrl = `/search?${newSearchParams.toString()}`
        if (newUrl !== window.location.pathname + window.location.search) {
            console.log("Updating URL to:", newUrl)
            navigate(newUrl, { replace: true })
        }
    }, [keyword, selectedCategories, page, navigate])

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryApi.list({})
                if (res.status_code === 200) {
                    const categoriesData = res.data?.categories || []
                    setAllCategories(categoriesData)
                } else {
                    console.error("API danh mục trả về lỗi:", res)
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error)
            }
        }
        fetchCategories()
    }, [])

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            const categoryMap = {}
            allCategories.forEach(category => {
                categoryMap[category.category_id] = { ...category, children: [] }
            })
            allCategories.forEach(category => {
                if (category.parent_id && categoryMap[category.parent_id]) {
                    categoryMap[category.parent_id].children.push(categoryMap[category.category_id])
                }
            })

            try {
                const filterGroup = buildFilters()
                const params = {
                    page,
                    limit: 12,
                    ...(filterGroup && { filters: filterGroup }),
                    ...(sort.field && { sort: sort.field }),
                    ...(sort.order && { order: sort.order })
                }
                console.log("Fetching products with params:", params)
                const res = await productApi.search(params)
                if (res.status_code === 200) {
                    const productsData = res.data?.data || []
                    const newTotalPage = res.data?.total_page || 1
                    setProducts(productsData)
                    setTotalPage(newTotalPage)

                    // Adjust page if it exceeds totalPage
                    if (page > newTotalPage) {
                        console.log(`Adjusting page from ${page} to ${newTotalPage}`)
                        setPage(newTotalPage)
                    }

                    console.log("Products returned:", productsData)

                    const productCategoryIds = [...new Set(productsData.map(p => p.category_id))]
                    if (keyword.trim() && productCategoryIds.length > 0) {
                        const relatedCategories = []
                        productCategoryIds.forEach(id => {
                            let currentId = id
                            while (currentId && categoryMap[currentId]) {
                                if (!relatedCategories.find(cat => cat.category_id === currentId)) {
                                    relatedCategories.push(categoryMap[currentId])
                                }
                                currentId = categoryMap[currentId].parent_id
                            }
                        })
                        const rootCategories = relatedCategories.filter(
                            category => !category.parent_id || !categoryMap[category.parent_id]
                        )
                        setFilterCategories(rootCategories)
                    } else {
                        const rootCategories = allCategories.filter(
                            category => !category.parent_id || !categoryMap[category.parent_id]
                        )
                        setFilterCategories(rootCategories)
                    }
                } else {
                    console.error("API sản phẩm trả về lỗi:", res)
                    setProducts([])
                    setTotalPage(1)
                    setFilterCategories(allCategories.filter(category => !category.parent_id))
                }
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error)
                setProducts([])
                setTotalPage(1)
                setFilterCategories(allCategories.filter(category => !category.parent_id))
            } finally {
                setIsLoading(false)
            }
        }
        if (allCategories.length > 0) {
            fetchProducts()
        }
    }, [page, keyword, selectedCategories, priceRange, sort, allCategories, buildFilters])

    const handleCategoryChange = useCallback((categories) => {
        console.log("Category change:", categories)
        setSelectedCategories(categories)
        setPage(1)
    }, [])

    const handlePriceChange = useCallback((min, max) => {
        console.log("Price change:", { min, max })
        setPriceRange({ min, max })
        setPage(1)
    }, [])

    const handleSortChange = useCallback((sortValue) => {
        console.log("Sort change:", sortValue)
        if (sortValue === "default") {
            setSort({ field: "", order: "" })
        } else {
            const [field, order] = sortValue.split("-")
            setSort({ field, order })
        }
        setPage(1)
    }, [])

    const handleReset = useCallback(() => {
        console.log("Reset filters")
        setSelectedCategories([])
        setPriceRange({ min: 0, max: 20000000 })
        setSort({ field: "", order: "" })
        setPage(1)
        setShowMobileFilters(false)
    }, [])

    const handlePageChange = useCallback((newPage) => {
        console.log("Page change:", newPage)
        if (newPage >= 1 && newPage <= totalPage && newPage !== page) {
            setPage(newPage)
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }, [page, totalPage])

    const activeFilterCount = () => {
        let count = 0
        if (selectedCategories.length > 0) count++
        if (priceRange.min > 0 || priceRange.max < 20000000) count++
        return count
    }

    // Generate page numbers for display with ellipsis
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxPagesToShow = 5 // Show up to 5 page numbers at a time
        const halfPagesToShow = Math.floor(maxPagesToShow / 2)

        let startPage = Math.max(1, page - halfPagesToShow)
        let endPage = Math.min(totalPage, startPage + maxPagesToShow - 1)

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

        if (endPage < totalPage) {
            if (endPage < totalPage - 1) pageNumbers.push("...")
            pageNumbers.push(totalPage)
        }

        return pageNumbers
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-6 pt-28">
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
                    {showMobileFilters && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
                            <div className="absolute right-0 top-0 h-full w-[80%] max-w-md bg-white shadow-xl p-4 overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold flex items-center">
                                        <SlidersHorizontal className="h-5 w-5 mr-2" />
                                        Bộ lọc
                                    </h3>
                                    <Button variant="ghost" onClick={() => setShowMobileFilters(false)}>
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
                                    isLoading={isLoading}
                                />
                                <div className="mt-6 flex gap-3">
                                    <Button className="w-full" onClick={() => setShowMobileFilters(false)}>
                                        Áp dụng
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleReset}
                                    >
                                        Đặt lại
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="hidden md:block md:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-28">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center">
                                    <SlidersHorizontal className="h-5 w-5 mr-2" />
                                    Bộ lọc
                                </h3>
                            </div>
                            <SearchFilters
                                categories={filterCategories}
                                onCategoryChange={handleCategoryChange}
                                onPriceChange={handlePriceChange}
                                onReset={handleReset}
                                selectedCategories={selectedCategories}
                                priceRange={priceRange}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>

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
                                        <span className="text-sm text-gray-500">Danh mục đã chọn:</span>
                                        {selectedCategories.map((catId) => {
                                            const category = allCategories.find((c) => c.category_id === catId)
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
                            <>
                                <ProductGrid products={products} />
                                {totalPage > 1 && (
                                    <Pagination className="justify-start ms-5 mt-4 mb-4">
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(page - 1)}
                                                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
                                                            onClick={() => handlePageChange(pageNum)}
                                                            isActive={page === pageNum}
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    )}
                                                </PaginationItem>
                                            ))}

                                            <PaginationItem>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(page + 1)}
                                                    className={page === totalPage ? "pointer-events-none opacity-50" : ""}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </PaginationLink>
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Search className="h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                                        Không tìm thấy sản phẩm phù hợp với từ khóa "{keyword}" và danh mục đã chọn. Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}