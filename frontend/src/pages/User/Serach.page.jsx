import { useEffect, useState } from "react";
import productApi from "@/apis/modules/product.api.ts";
import { SearchFilters } from "@/components/common/search/SearchFilters";
import { SortOptions } from "@/components/common/search/SortOptions";
import ProductGrid from "@/components/common/product/ProductGrid";
import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const [products, setProducts] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 20000000 });
    const [sort, setSort] = useState({ field: "", order: "" });
    const [filterCategories, setFilterCategories] = useState([]);

    // Chỉ cập nhật filterCategories khi keyword thay đổi (hoặc lần đầu)
    useEffect(() => {
        const fetchFilterCategories = async () => {
            let data = [];
            if (keyword.trim()) {
                // Có keyword: lấy sản phẩm theo keyword
                const filters = [
                    { logic: "OR", filters: [
                        { field: "product.name", condition: "contains", value: keyword.trim() },
                        { field: "product.description_normal", condition: "contains", value: keyword.trim() }
                    ]}
                ];
                const params = { page: 1, limit: 1000, filters, logic: "OR" };
                const res = await productApi.search(params);
                data = res.data?.data || [];
            } else {
                // Không có keyword: lấy tất cả sản phẩm
                const params = { page: 1, limit: 1000 };
                const res = await productApi.search(params);
                data = res.data?.data || [];
            }
            // Lấy unique categories từ data
            const uniqueCategories = [];
            const categoryIds = new Set();
            data.forEach(item => {
                if (item.category_id && !categoryIds.has(item.category_id)) {
                    categoryIds.add(item.category_id);
                    uniqueCategories.push({
                        id: item.category_id,
                        name: item.categories,
                    });
                }
            });
            setFilterCategories(uniqueCategories);
        };
        fetchFilterCategories();
    }, []);

    // Build filters cho API lấy sản phẩm
    const buildFilters = () => {
        const keywordFilters = [
            { field: "product.name", condition: "contains", value: keyword.trim() },
            { field: "product.description_normal", condition: "contains", value: keyword.trim() }
        ];
        const otherFilters = [];
        if (selectedCategories.length > 0) {
            otherFilters.push({
                field: "product.category_id",
                condition: "in",
                value: selectedCategories,
            });
        }
        if (priceRange.min) {
            otherFilters.push({
                field: "product.selling_price",
                condition: ">=",
                value: priceRange.min,
            });
        }
        if (priceRange.max && priceRange.max < 100000000) {
            otherFilters.push({
                field: "product.selling_price",
                condition: "<=",
                value: priceRange.max,
            });
        }

        // Nếu chỉ có keyword, trả về mảng filter đơn giản (logic OR)
        if (keyword.trim() && otherFilters.length === 0) {
            return {
                logic: "OR",
                filters: keywordFilters
            };
        }

        // Nếu có thêm filter khác, trả về group filter (logic AND, trong đó có group OR cho keyword)
        const filters = [];
        if (keyword.trim()) {
            filters.push({
                logic: "OR",
                filters: keywordFilters
            });
        }
        filters.push(...otherFilters);

        return {
            logic: "AND",
            filters
        };
    };

    // Lấy sản phẩm theo các điều kiện filter hiện tại
    useEffect(() => {
        const fetchProducts = async () => {
            const filterGroup = buildFilters();
            const params = {
                page,
                limit: 12,
                filters: filterGroup,
                sort: sort.field,
                order: sort.order,
            };
            const res = await productApi.search(params);
            setProducts(res.data?.data || []);
            setTotalPage(res.data?.total_page || 1);
        };
        fetchProducts();
    }, [page, selectedCategories, priceRange, sort, keyword])

    // Xử lý filter/sort
    const handleCategoryChange = (categories) => setSelectedCategories(categories);
    const handlePriceChange = (min, max) => setPriceRange({ min, max });
    const handleSortChange = (sortValue) => {
        if (sortValue === "default") setSort({ field: "", order: "" });
        else {
            const [field, order] = sortValue.split("-");
            setSort({ field, order });
        }
    };
    const handleReset = () => {
        setSelectedCategories([]);
        setPriceRange({ min: 0, max: 20000000 });
        setSort({ field: "", order: "" });
        setPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                    <SearchFilters
                        categories={filterCategories}
                        onCategoryChange={handleCategoryChange}
                        onPriceChange={handlePriceChange}
                        onReset={handleReset}
                        selectedCategories={selectedCategories}
                        priceRange={priceRange}
                    />
                </div>
                <div className="md:col-span-3">
                    <div className="mb-6">
                        <SortOptions onSortChange={handleSortChange} />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">
                        Có tổng {products.length} thiết bị được tìm thấy
                    </h3>
                    <ProductGrid products={products} />
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
    );
}