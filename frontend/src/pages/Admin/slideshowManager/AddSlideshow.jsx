import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SlideshowApi from "@/apis/modules/slideshow.api.ts";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import Swal from 'sweetalert2';
import ImageCropper from "@/components/common/ImageCropper";
import { Upload } from "lucide-react";

const AddSlideshowPage = () => {
    const [formData, setFormData] = useState({
        text_button: "",
        link: "",
        image: "",
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const navigate = useNavigate();

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
                setTempImage(reader.result);
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImage) => {
        setFormData(prev => ({ ...prev, image: croppedImage }));
        setShowCropModal(false);
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
                text_button: formData.text_button,
                link: formData.link,
                image: formData.image,
                status: formData.status ? 1 : 0
            };
            const res = await SlideshowApi.create(dataToSubmit);
            const isSuccessStatus = res.status_code && (
                (typeof res.status_code === "number" && res.status_code >= 200 && res.status_code < 300) ||
                (typeof res.status_code === "string" && res.status_code.startsWith("2"))
            );
            if (!isSuccessStatus || (res.errors && res.errors.length > 0)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: res.errors?.[0]?.message || res.message || "Có lỗi xảy ra!"
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Thêm slideshow thành công'
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

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-xl font-bold mb-6">Thêm slideshow</h1>
            <form onSubmit={handleSubmit} className="p-0">
                <div className="grid grid-cols-12 gap-6 items-center">
                    <div className="col-span-2">
                        <Label htmlFor="text_button">Nội dung nút<span className="text-red-500">*</span> :</Label>
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
                        <Label htmlFor="link">Link đích<span className="text-red-500">*</span> :</Label>
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

                    <div className="col-span-2">
                        <Label htmlFor="image">Hình ảnh<span className="text-red-500">*</span> :</Label>
                    </div>
                    <div className="col-span-10">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className="relative flex h-[150px] w-[150px] cursor-pointer flex-col items-center justify-center rounded-md border bg-muted"
                                    onClick={() => document.getElementById("image-upload").click()}
                                >
                                    {formData.image ? (
                                        <img
                                            src={formData.image}
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
                            </div>
                        </div>
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

            {/* Modal cắt ảnh */}
            {showCropModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4">
                        <div className="p-6">
                            <ImageCropper
                                image={tempImage}
                                onCropComplete={handleCropComplete}
                                aspectRatio={16 / 5}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddSlideshowPage; 