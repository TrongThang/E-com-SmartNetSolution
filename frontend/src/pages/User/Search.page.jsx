"use client"

import { useEffect, useState } from "react"
import productApi from "@/apis/modules/product.api.ts"
import categoryApi from "@/apis/modules/categories.api.ts"
import { SearchFilters } from "@/components/common/search/SearchFilters"
import { SortOptions } from "@/components/common/search/SortOptions"
import ProductGrid from "@/components/common/product/ProductGrid"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Filter, SlidersHorizontal, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get("keyword") || ""
    const categoryParam = searchParams.get("category") || ""
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

    // Build filters cho API lấy sản phẩm
    const buildFilters = () => {
        const filters = [];

        // Thêm filter cho keyword nếu có
        if (keyword.trim()) {
            filters.push({
                logic: "OR",
                filters: [
                    { field: "product.name", condition: "contains", value: keyword.trim() },
                    { field: "product.description_normal", condition: "contains", value: keyword.trim() }
                ]
            });
        }

        // Thêm filter cho danh mục nếu có
        if (selectedCategories.length > 0) {
            // Hàm đệ quy để lấy tất cả ID danh mục con (mọi cấp)
            const getAllChildIds = (categoryId, categories) => {
                let ids = [categoryId];
                const children = categories.filter(cat => cat.parent_id === categoryId);
                for (const child of children) {
                    ids = ids.concat(getAllChildIds(child.category_id, categories));
                }
                return ids;
            };

            let allCategoryIds = [];
            selectedCategories.forEach(id => {
                allCategoryIds = allCategoryIds.concat(getAllChildIds(id, allCategories));
            });
            allCategoryIds = [...new Set(allCategoryIds)]; // loại bỏ trùng lặp
            filters.push({
                field: "product.category_id",
                condition: "in",
                value: allCategoryIds
            });
        }

        // Thêm filter cho giá nếu có
        if (priceRange.min > 0) {
            filters.push({
                field: "product.selling_price",
                condition: ">=",
                value: priceRange.min
            });
        }
        if (priceRange.max && priceRange.max < 100000000) {
            filters.push({
                field: "product.selling_price",
                condition: "<=",
                value: priceRange.max
            });
        }

        // Nếu không có filter nào, trả về null để lấy tất cả sản phẩm
        if (filters.length === 0) {
            return null;
        }

        // Nếu chỉ có một filter, trả về filter đó
        if (filters.length === 1) {
            return filters[0];
        }

        // Nếu có nhiều filter, kết hợp chúng với logic AND
        return {
            logic: "AND",
            filters
        };
    };

    // Khởi tạo selectedCategories từ URL parameter (và reset page về 1 khi đổi filter)
    useEffect(() => {
        if (categoryParam) {
            try {
                const categories = categoryParam.split(',').map(id => parseInt(id));
                if (JSON.stringify(categories) !== JSON.stringify(selectedCategories)) {
                    setSelectedCategories(categories);
                }
            } catch (error) {
                console.error("Error parsing category parameters:", error);
                setSelectedCategories([]);
            }
        } else {
            setSelectedCategories([]);
        }
        setPage(1);
    }, [categoryParam]);

    // Lấy sản phẩm theo các điều kiện filter hiện tại
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const filterGroup = buildFilters();
                const params = {
                    page,
                    limit: 12,
                    ...(filterGroup && { filters: filterGroup }),
                    ...(sort.field && { sort: sort.field }),
                    ...(sort.order && { order: sort.order })
                };
                const res = await productApi.search(params);
                if (res.status_code === 200) {
                    setProducts(res.data?.data || []);
                    setTotalPage(res.data?.total_page || 1);
                } else {
                    setProducts([]);
                    setTotalPage(1);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
                setTotalPage(1);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [page, categoryParam, priceRange, sort, keyword]);

    // Lấy danh mục từ API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryApi.list({});
                if (res.status_code === 200) {
                    const categoriesData = res.data?.categories || [];
                    setAllCategories(categoriesData);
                    // Xây dựng cấu trúc cây danh mục
                    const categoryMap = {};
                    categoriesData.forEach(category => {
                        categoryMap[category.category_id] = {
                            ...category,
                            children: []
                        };
                    });

                    // Thêm danh mục con vào danh mục cha
                    categoriesData.forEach(category => {
                        if (category.parent_id && categoryMap[category.parent_id]) {
                            categoryMap[category.parent_id].children.push(categoryMap[category.category_id]);
                        }
                    });

                    // Lọc ra các danh mục gốc
                    const rootCategories = categoriesData.filter(category =>
                        !category.parent_id || !categoryMap[category.parent_id]
                    );

                    setFilterCategories(rootCategories);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Xử lý filter/sort
    const handleCategoryChange = (categories) => {
        const newSearchParams = new URLSearchParams(searchParams);
        // Xóa tất cả các parameters hiện tại ngoại trừ keyword
        Array.from(newSearchParams.keys()).forEach(key => {
            if (key !== 'keyword') {
                newSearchParams.delete(key);
            }
        });

        // Thêm lại category nếu có
        if (categories.length > 0) {
            newSearchParams.set('category', categories.join(','));
        }

        // Navigate với parameters mới
        navigate(`/search?${newSearchParams.toString()}`);
    };

    const handlePriceChange = (min, max) => {
        setPriceRange({ min, max });
    };

    const handleSortChange = (sortValue) => {
        if (sortValue === "default") {
            setSort({ field: "", order: "" });
        } else {
            const [field, order] = sortValue.split("-");
            setSort({ field, order });
        }
    };

    const handleReset = () => {
        // Reset all states
        setSelectedCategories([]);
        setPriceRange({ min: 0, max: 20000000 });
        setSort({ field: "", order: "" });
        setPage(1);

        // Reset URL completely - remove all parameters
        navigate('/search');

        // Close mobile filters if open
        if (showMobileFilters) {
            setShowMobileFilters(false);
        }
    };

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
                                            const category = filterCategories.find((c) => c.category_id === catId)
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
