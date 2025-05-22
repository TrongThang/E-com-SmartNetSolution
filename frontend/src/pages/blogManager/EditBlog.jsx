import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import blogApi from "@/apis/modules/blog.api.ts";
import categoryApi from "@/apis/modules/categories.api.ts";
import productApi from "@/apis/modules/product.api.ts";
import employeeApi from "@/apis/modules/employee.api.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { Editor } from '@tinymce/tinymce-react';
import ImageCropper from "@/components/common/ImageCropper";

const EditBlog = () => {
    const { id } = useParams();
    const [form, setForm] = useState({
        title: "",
        author: "",
        category_id: "",
        product_id: "",
        content: "",
        content_normal: "",
        image: "",
        is_hide: false,
    });
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            categoryApi.list({}),
            productApi.list({}),
            employeeApi.list({})
        ]).then(([cateRes, prodRes, empRes]) => {
            setCategories(cateRes.data?.categories || cateRes.data?.data || []);
            setProducts(prodRes.data?.data || []);
            setEmployees(empRes.data?.data || []);
            blogApi.getById(id).then(res => {
                if (res.data) {
                    const blogData = res.data;
                    setForm({
                        ...blogData,
                        author: blogData.author_id ? String(blogData.author_id) : "",
                        category_id: blogData.category_id ?? "",
                        product_id: blogData.product_id ?? "",
                        is_hide: !!blogData.is_hide,
                    });
                } else {
                    Swal.fire({ icon: "error", title: "Lỗi!", text: "Không tìm thấy bài viết!" });
                    navigate("/admin/blogs");
                }
            }).catch(() => {
                Swal.fire({ icon: "error", title: "Lỗi!", text: "Có lỗi xảy ra khi tải bài viết!" });
                navigate("/admin/blogs");
            });
        });
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if ((name === "title" || name === "content") && value.length === 1 && value[0] === " ") return;
        if (name === "author") {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        } else if (["category_id", "product_id"].includes(name)) {
            setForm(prev => ({
                ...prev,
                [name]: value === "" ? "" : Number(value)
            }));
        } else if (type === "checkbox") {
            setForm(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setTempImage(reader.result);
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = (croppedImage) => {
        setForm(prev => ({ ...prev, image: croppedImage }));
        setShowCropModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.content_normal || form.content_normal.trim() === "<p></p>" || !form.content_normal.replace(/<[^>]+>/g, '').trim()) {
            Swal.fire({ icon: "warning", title: "Lỗi!", text: "Nội dung chi tiết không được để trống!" });
            return;
        }
        if (!form.image) {
            Swal.fire({ icon: "warning", title: "Lỗi!", text: "Vui lòng chọn hình ảnh cho bài viết!" });
            return;
        }
        setLoading(true);
        try {
            const dataToSend = {
                ...form,
                id: Number(id),
                category_id: form.category_id === "" ? null : form.category_id,
                product_id: form.product_id === "" ? null : form.product_id,
                author: form.author === "" ? null : form.author,
                is_hide: form.is_hide === "true" || form.is_hide === true,
            };
            const res = await blogApi.edit(dataToSend);
            if (res.error && res.error !== 0) {
                Swal.fire({ icon: "error", title: "Lỗi!", text: res.message || "Có lỗi xảy ra!" });
            } else {
                Swal.fire({ icon: "success", title: "Thành công!", text: "Đã cập nhật bài viết thành công" });
                navigate("/admin/blogs");
            }
        } catch (err) {
            const apiError = err?.response?.data?.message || "Có lỗi xảy ra!";
            Swal.fire({ icon: "error", title: "Lỗi!", text: apiError });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-4">Cập nhật bài viết</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex">
                    {/* Left: Form fields */}
                    <div className="flex-1">
                        <div className="mb-2 flex items-center">
                            <label className="w-40 block">Tiêu đề bài viết:</label>
                            <Input className="flex-1" name="title" value={form.title} onChange={handleChange} required />
                        </div>
                        <div className="mb-2 flex items-center">
                            <label className="w-40 block">Tên tác giả:</label>
                            <select
                                className="flex-1 border rounded px-2 py-1"
                                name="author"
                                value={form.author}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Chọn nhân viên --</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.surname} {emp.lastname}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2 flex items-center">
                            <label className="w-40 block">Tên danh mục:</label>
                            <select
                                className="flex-1 border rounded px-2 py-1"
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map(c => (
                                    <option key={c.category_id} value={c.category_id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2 flex items-center">
                            <label className="w-40 block">Tên sản phẩm:</label>
                            <select
                                className="flex-1 border rounded px-2 py-1"
                                name="product_id"
                                value={form.product_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Chọn sản phẩm --</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2 flex items-center">
                            <label className="w-40 block">Nội dung ngắn:</label>
                            <Input className="flex-1" name="content" value={form.content} onChange={handleChange} required />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">Nội dung chi tiết:</label>
                            <Editor
                                apiKey='0nubcibo2309ceuid0afingqvggqyaqjeve4yl82ls7xagug'
                                init={{
                                    height: 320,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar:
                                        'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                                }}
                                value={form.content_normal}
                                onEditorChange={(newValue) => setForm(prev => ({ ...prev, content_normal: newValue }))}
                                required
                            />
                        </div>
                    </div>
                    {/* Right: Image + Status */}
                    <div className="w-72 ml-8 flex flex-col items-center">
                        <label className="block mb-1">Hình ảnh:</label>
                        <div className="w-40 h-40 border flex items-center justify-center mb-2 bg-gray-100">
                            {form.image ? (
                                <img src={form.image} alt="preview" className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-gray-400">Upload ảnh</span>
                            )}
                        </div>
                        <input type="file" accept="image/*" className="mb-2" onChange={handleImageChange} />
                        <label className="block mb-1">Trạng thái:</label>
                        <select
                            className="w-full border rounded px-2 py-1"
                            name="is_hide"
                            value={form.is_hide ? "true" : "false"}
                            onChange={handleChange}
                        >
                            <option value="false">Hiển thị</option>
                            <option value="true">Ẩn</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" variant="outline" className="px-6 hover:opacity-70" onClick={() => navigate("/admin/blogs")}>Hủy</Button>
                    <Button type="submit" className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2" disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu"}
                    </Button>
                </div>
            </form>

            {/* Modal cắt ảnh */}
            {showCropModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4">
                        <div className="p-6">
                            <ImageCropper
                                image={tempImage}
                                onCropComplete={handleCropComplete}
                                aspectRatio={16 / 9}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditBlog;
