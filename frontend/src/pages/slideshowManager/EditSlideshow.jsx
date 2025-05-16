import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SlideshowApi from "@/apis/modules/slideshow.api.ts";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import Swal from 'sweetalert2';

const EditSlideshowPage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        text_button: "",
        link: "",
        image: "",
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSlideshow = async () => {
            try {
                const res = await SlideshowApi.detail(id);
                if (res.status_code === 200) {
                    setFormData({
                        text_button: res.data?.text_button || "",
                        link: res.data?.link || "",
                        image: res.data?.image || "",
                        status: res.data?.status || true
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Không thể tải thông tin slideshow'
                    });
                    navigate("/admin/slideshows");
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Đã xảy ra lỗi khi tải thông tin slideshow'
                });
                navigate("/admin/slideshows");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchSlideshow();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.replace(/^\s+/, "")
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Compress image before setting state
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to JPEG with 0.8 quality
                    const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
                    setFormData(prev => ({
                        ...prev,
                        image: compressedImage
                    }));
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStatusChange = (checked) => {
        setFormData(prev => ({
            ...prev,
            status: checked
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.text_button.trim() || !formData.link.trim() || !formData.image) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Vui lòng điền đầy đủ thông tin và không để trống hoặc chỉ có khoảng trắng ở các trường bắt buộc.'
            });
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit = {
                id: parseInt(id, 10),
                text_button: formData.text_button,
                link: formData.link,
                image: formData.image,
                status: formData.status ? 1 : 0
            };
            const res = await SlideshowApi.update(dataToSubmit);
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
                    text: 'Cập nhật slideshow thành công'
                });
                navigate("/admin/slideshows");
            }
        } catch (err) {
            const apiError = err?.response?.data?.errors?.[0]?.message;
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: apiError || "Có lỗi xảy ra!"
            });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-xl font-bold mb-6">Chỉnh sửa slideshow</h1>
            <form onSubmit={handleSubmit} className="p-0">
                <div className="grid grid-cols-12 gap-6 items-center">
                    <div className="col-span-2">
                        <Label htmlFor="text_button" >Nội dung nút<span className="text-red-500">*</span> :</Label>
                    </div>
                    <div className="col-span-10">
                        <Input
                            id="text_button"
                            name="text_button"
                            value={formData.text_button}
                            onChange={handleChange}
                            placeholder="Nhập tên nút"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="link" >Link đích<span className="text-red-500">*</span> :</Label>
                    </div>
                    <div className="col-span-10">
                        <Input
                            id="link"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="Nhập đường dẫn"
                            required
                        />
                    </div>

                    <div className="col-span-2 flex flex-col gap-2">
                        <Label htmlFor="image">Hình ảnh<span className="text-red-500">*</span> :</Label>
                        <span className="text-xs text-gray-400">Upload ảnh</span>
                    </div>
                    <div className="col-span-4 flex flex-col gap-2">
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {formData.image && (
                            <div className="mt-2">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-32 h-32 object-contain border rounded bg-gray-100"
                                />
                            </div>
                        )}
                    </div>
                    <div className="col-span-2 flex items-center">
                        <Label htmlFor="status">Trạng thái:</Label>
                    </div>
                    <div className="col-span-4 flex items-center gap-2">
                        <select
                            id="status"
                            name="status"
                            className="border rounded px-2 py-1 text-sm"
                            value={formData.status ? 1 : 0}
                            onChange={e => handleStatusChange(e.target.value === '1')}
                        >
                            <option value={1}>Hiện</option>
                            <option value={0}>Ẩn</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-8">
                    <Button
                        type="button"
                        className="px-6 bg-gray-500 text-white hover:opacity-70"
                        onClick={() => navigate("/admin/slideshows")}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        className="px-6 bg-black text-white hover:opacity-70"
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Lưu"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditSlideshowPage; 