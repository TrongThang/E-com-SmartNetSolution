import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import blogApi from "@/apis/modules/blog.api.ts";
import BlogCard from "@/components/common/blog/BlogCard";
import BlogSkeleton from "@/components/common/blog/BlogSkeleton";
import BlogSearch from "@/components/common/blog/BlogSearch";
import BlogPagination from "@/components/common/blog/BlogPagination";

const PAGE_SIZE = 6;

export default function BlogListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [totalPage, setTotalPage] = useState(1);

    // Lọc, tìm kiếm và sắp xếp tại frontend
    const filteredBlogs = useMemo(() => {
        let result = blogs;

        // Lọc is_hide = 0 và deleted_at = null
        result = result.filter(blog => blog.is_hide === 0 && blog.deleted_at === null);

        // Tìm kiếm theo title (không phân biệt dấu)
        if (search) {
            result = result.filter(blog => {
                const title = blog.title.toLowerCase();
                const searchTerm = search.toLowerCase();
                const titleWithoutDiacritics = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const searchWithoutDiacritics = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return title.includes(searchTerm) || titleWithoutDiacritics.includes(searchWithoutDiacritics);
            });
        }

        // Sắp xếp theo created_at DESC
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return result;
    }, [blogs, search]);

    // Tính dữ liệu cho trang hiện tại
    const currentBlogs = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE;
        return filteredBlogs.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredBlogs, page]);

    useEffect(() => {
        setLoading(true);

        blogApi
            .list({})
            .then((res) => {
                if (res && res.data) {
                    setBlogs(res.data);
                    const total = res.data.length;
                    setTotalPage(Math.ceil(total / PAGE_SIZE));
                } else {
                    setBlogs([]);
                    setTotalPage(1);
                }
            })
            .catch((error) => {
                console.error("Error fetching blogs:", error);
                setBlogs([]);
                setTotalPage(1);
            })
            .finally(() => setLoading(false));
    }, []);

    // Cập nhật URL params
    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (page > 1) params.set("page", page.toString());
        setSearchParams(params);
    }, [search, page, setSearchParams]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPage) {
            setPage(newPage);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pt-28">
            <h1 className="text-3xl font-bold text-center mb-2">Danh sách bài viết</h1>
            <p className="text-lg text-center text-gray-500 mb-6">
                Nơi bạn tìm thấy thông tin hữu ích, sản phẩm mới nổi bật và lời khuyên từ chuyên gia về SmartHome
            </p>

            <BlogSearch search={search} onSearchChange={setSearch} />

            {loading ? (
                <BlogSkeleton count={PAGE_SIZE} />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentBlogs.map(blog => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                    <BlogPagination
                        page={page}
                        totalPage={totalPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}
