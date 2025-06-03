import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WarrantyTimeApi from "@/apis/modules/warrantyTime.api.ts";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import Swal from 'sweetalert2';

const EditWarrantyTimePage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        time: ""
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWarrantyTime = async () => {
            try {
                const res = await WarrantyTimeApi.detail(id);
                if (res.status_code === 200) {
                    setFormData({
                        name: res.data?.name || "",
                        time: res.data?.time || ""
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Không thể tải thông tin thời gian bảo hành'
                    });
                    navigate("/admin/warranty-times");
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Đã xảy ra lỗi khi tải thông tin thời gian bảo hành'
                });
                navigate("/admin/warranty-times");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchWarrantyTime();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'time') {
            // Chỉ cho phép nhập số nguyên dương
            const positiveInt = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: positiveInt
            }));
        } else {
            // Loại bỏ khoảng trắng ở đầu và cuối
            const trimmedValue = value.trimStart();
            setFormData(prev => ({
                ...prev,
                [name]: trimmedValue
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedName = formData.name.trim();
        if (!trimmedName || !formData.time) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Vui lòng điền đầy đủ thông tin'
            });
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit = {
                id: parseInt(id, 10),
                name: trimmedName,
                time: parseInt(formData.time, 10)
            };
            const res = await WarrantyTimeApi.update(dataToSubmit);
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
                    text: 'Cập nhật thời gian bảo hành thành công'
                });
                navigate("/admin/warranty-times");
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
        <div>
            <h1 className="text-xl font-bold mb-4">Chỉnh sửa thời gian bảo hành</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name" className="mb-2 block">Tên thời gian bảo hành<span className="text-red-500">*</span> :</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên thời gian bảo hành"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="time" className="mb-2 block">Thời gian (tháng)<span className="text-red-500">*</span> :</Label>
                    <Input
                        id="time"
                        name="time"
                        type="text"
                        value={formData.time}
                        onChange={handleChange}
                        placeholder="Nhập số tháng"
                        required
                        min="1"
                        pattern="[0-9]*"
                        inputMode="numeric"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        type="submit"
                        className="px-6 bg-black text-white hover:opacity-70"
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Cập nhật"}
                    </Button>
                    <Button
                        type="button"
                        className="px-6 bg-gray-500 text-white hover:opacity-70"
                        onClick={() => navigate("/admin/warranty-times")}
                    >
                        Hủy
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditWarrantyTimePage; 