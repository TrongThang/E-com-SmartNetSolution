import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import blogApi from "@/apis/modules/blog.api.ts";
import BlogTable from "@/components/common/Table/BlogTable";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const BlogManagerPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchBlogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await blogApi.list({});
            if (res.data) {
                setBlogs(res.data);
            } else {
                setError("Không thể tải danh sách blog");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải danh sách blog");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleAdd = () => navigate("/admin/blogs/add");
    const handleEdit = (blog) => navigate(`/admin/blogs/edit/${blog.id}`);
    const handleDelete = async (blog) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn có chắc chắn muốn xóa bài viết này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const res = await blogApi.delete(blog.id);
                if (res.error && res.error !== 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: res.message || "Có lỗi xảy ra!"
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: 'Đã xóa bài viết thành công'
                    });
                    fetchBlogs();
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: "Có lỗi xảy ra!"
                });
            }
        }
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Quản lý bài viết</h1>
            <div className="flex items-center justify-between mb-4">
                <Button
                    type="button"
                    className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2"
                    onClick={handleAdd}
                >
                    <span className="text-lg">+</span> Thêm bài viết
                </Button>
            </div>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <BlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default BlogManagerPage;
