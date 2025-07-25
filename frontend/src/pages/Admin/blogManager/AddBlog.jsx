import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import blogApi from "@/apis/modules/blog.api.ts";
import categoryApi from "@/apis/modules/categories.api.ts";
import productApi from "@/apis/modules/product.api.ts";
import employeeApi from "@/apis/modules/employee.api.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { Editor } from '@tinymce/tinymce-react';
import ImageCropper from "@/components/common/ImageCropper";
import { Upload, ArrowLeft } from "lucide-react";

const AddBlog = () => {
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
        categoryApi.list({}).then(res => setCategories(res.data?.categories || []));
        productApi.list({}).then(res => setProducts(res.data?.data || []));
        employeeApi.list({}).then(res => setEmployees(res.data?.data || []));
    }, []);

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
                category_id: form.category_id === "" ? null : form.category_id,
                product_id: form.product_id === "" ? null : form.product_id,
                author: form.author === "" ? null : form.author,
                is_hide: form.is_hide === "true" || form.is_hide === true,
            };
            const res = await blogApi.add(dataToSend);
            const isSuccessStatus = res.status_code && (
                (typeof res.status_code === "number" && res.status_code >= 200 && res.status_code < 300) ||
                (typeof res.status_code === "string" && res.status_code.startsWith("2"))
            );
            if (!isSuccessStatus || (res.errors && res.errors.length > 0)) {
                Swal.fire({ icon: "error", title: "Lỗi!", text: res.errors?.[0]?.message || res.message || "Có lỗi xảy ra!" });
            } else {
                Swal.fire({ icon: "success", title: "Thành công!", text: "Đã thêm bài viết thành công" });
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
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="xl" asChild className="gap-1">
                    <Link to="/admin/blogs">
                        <ArrowLeft className="h-4 w-4" />
                        Trở về
                    </Link>
                </Button>
            </div>
            <h2 className="text-xl font-bold mb-4">Thêm bài viết mới</h2>
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
                                tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                                init={{
                                    height: 320,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'help', 'wordcount',
                                        'emoticons', 'media', 'preview', 'table'

                                    ],
                                    toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify |  outdent indent | removeformat link image|fullscreen code| emoticons preview table help',

                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    skin_url: '/tinymce/skins/ui/oxide',
                                    content_css: '/tinymce/skins/content/default/content.css',
                                    language: 'vi',
                                    language_url: '/tinymce/langs/vi.js',
                                    base_url: '/tinymce'
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
                        <div
                            className="relative flex h-[150px] w-[150px] cursor-pointer flex-col items-center justify-center rounded-md border bg-muted"
                            onClick={() => document.getElementById("image-upload").click()}
                        >
                            {form.image ? (
                                <img
                                    src={form.image}
                                    alt="Preview"
                                    className="h-full w-full rounded-md object-contain"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <Upload className="mb-2 h-10 w-10" />
                                    <span className="text-center text-sm">Upload ảnh</span>
                                </div>
                            )}
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <label className="block mb-1 mt-4">Trạng thái:</label>
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

export default AddBlog;
