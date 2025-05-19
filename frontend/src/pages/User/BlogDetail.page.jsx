// src/pages/User/BlogDetail.page.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import blogApi from "@/apis/modules/blog.api.ts";
import { formatDate } from "@/utils/format";
import RelatedBlogs from "@/components/common/blog/RelatedBlogs";

export default function BlogDetailPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedBlogs, setRelatedBlogs] = useState([]);

    // Lọc các bài viết liên quan
    const filteredRelatedBlogs = useMemo(() => {
        return relatedBlogs.filter(blog =>
            blog.is_hide === 0 && blog.deleted_at === null && blog.id !== parseInt(id)
        );
    }, [relatedBlogs, id]);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            blogApi.getById(id),
            blogApi.list({
                limit: 10,
                sort: "created_at",
                order: "desc"
            })
        ])
            .then(([blogRes, relatedRes]) => {
                // Kiểm tra bài viết chính
                if (blogRes.data && blogRes.data.is_hide === 0 && blogRes.data.deleted_at === null) {
                    setBlog(blogRes.data);
                } else {
                    setBlog(null);
                }

                // Xử lý bài viết liên quan
                if (relatedRes.data) {
                    const filteredBlogs = relatedRes.data.filter(blog =>
                        blog.is_hide === 0 && blog.deleted_at === null && blog.id !== parseInt(id)
                    );
                    const shuffled = filteredBlogs.sort(() => 0.5 - Math.random());
                    setRelatedBlogs(shuffled.slice(0, 5));
                } else {
                    setRelatedBlogs([]);
                }
            })
            .catch(() => {
                setBlog(null);
                setRelatedBlogs([]);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 ">
                <div className="flex gap-8">
                    <Card className="p-6 w-[60%]">
                        <div className="flex items-center gap-2 mb-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-8 w-1/2 mb-4" />
                        <Skeleton className="h-64 w-full mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </Card>
                    <div className="w-[35%]">
                        <Skeleton className="h-8 w-full mb-4" />
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full mb-4" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500 mb-4">Không tìm thấy bài viết</p>
                <Link to="/blog">
                    <Button variant="outline">Quay lại danh sách</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-28">
            <div className="flex gap-8 relative">
                <Card className="p-6 w-[60%]">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <i className="fa-regular fa-user text-gray-400" />
                        </div>
                        <span className="text-lg text-gray-500">{blog.author || "USERNAME"}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-lg text-gray-500">{blog.created_at ? formatDate(blog.created_at) : ""}</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
                    <div className="w-full bg-gray-200 rounded mb-4 overflow-hidden flex items-center justify-center">
                        {blog.image ? (
                            <img
                                src={blog.image.startsWith("data:") ? blog.image : `data:image/jpeg;base64,${blog.image}`}
                                alt={blog.title}
                                className="w-full h-auto"
                            />
                        ) : (
                            <span className="text-gray-400">No Image</span>
                        )}
                    </div>
                    <div className="text-gray-700  leading-relaxed whitespace-pre-line">
                        {blog.content ? (
                            <div dangerouslySetInnerHTML={{ __html: blog.content_normal }} />
                        ) : (
                            <span>Nội dung bài viết đang cập nhật...</span>
                        )}
                    </div>
                </Card>

                <RelatedBlogs blogs={filteredRelatedBlogs} />
            </div>
        </div>
    );
}