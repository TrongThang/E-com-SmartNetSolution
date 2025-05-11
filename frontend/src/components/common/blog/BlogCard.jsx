// src/components/common/blog/BlogCard.jsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/format";

export default function BlogCard({ blog }) {
    if (!blog) return null;
    return (
        <Card className="p-4 flex flex-col">
            <Link to={`/blog/${blog.id}`} className="h-56 w-full bg-gray-200 rounded mb-4 overflow-hidden flex items-center justify-center">
                {blog.image ? (
                    <img
                        src={blog.image.startsWith("data:") ? blog.image : `data:image/jpeg;base64,${blog.image}`}
                        alt={blog.title}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <span className="text-gray-400 text-2xl">No Image</span>
                )}
            </Link>
            {(blog.category_name || blog.product_name) && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    {blog.category_name && (
                        <span>
                            <i className="fa-solid fa-folder mr-1" />
                            {blog.category_name}
                        </span>
                    )}
                    {blog.category_name && blog.product_name && <span>|</span>}
                    {blog.product_name && (
                        <span>
                            <i className="fa-solid fa-box mr-1" />
                            {blog.product_name}
                        </span>
                    )}
                </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>
                    <i className="fa-regular fa-user mr-1" />
                    {blog.author || "USERNAME"}
                </span>
                <span>•</span>
                <span>{blog.created_at ? formatDate(blog.created_at) : ""}</span>
            </div>
            <Link to={`/blog/${blog.id}`} className="group">
                <h2 className="font-semibold text-2xl mb-1 line-clamp-2 group-hover:text-blue-600">{blog.title}</h2>
                <div className="text-sm text-gray-500 mb-4 line-clamp-2 group-hover:text-blue-600">
                    {blog.content ? blog.content.replace(/<[^>]+>/g, '').slice(0, 80) + "..." : "Nội dung ngắn của bài viết"}
                </div>
            </Link>
            <div className="mt-auto flex justify-between items-center">
                <Link to={`/blog/${blog.id}`}>
                    <Button variant="outline" size="sm" className="text-sm">Xem chi tiết</Button>
                </Link>
            </div>
        </Card>
    );
}