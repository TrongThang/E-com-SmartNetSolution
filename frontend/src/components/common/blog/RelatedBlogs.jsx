import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/utils/format";

export default function RelatedBlogs({ blogs }) {
    if (!blogs || blogs.length === 0) return null;

    return (
        <div className="w-[35%] sticky top-[60px] self-start">
            <h2 className="text-xl font-bold mb-4">Bài viết khác bạn có thể muốn xem:</h2>
            <div className="space-y-4">
                {blogs.map((blog) => (
                    <Link key={blog.id} to={`/blog/${blog.id}`}>
                        <Card className="p-3 hover:bg-gray-50 transition-colors">
                            <div className="flex gap-3">
                                <div className="w-24 h-20 bg-gray-200 rounded overflow-hidden">
                                    {blog.image ? (
                                        <img
                                            src={blog.image.startsWith("data:") ? blog.image : `data:image/jpeg;base64,${blog.image}`}
                                            alt={blog.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-medium line-clamp-2 mb-1">{blog.title}</h3>
                                    <p className="text-lg text-gray-500">{formatDate(blog.created_at)}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
