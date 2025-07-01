import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SlideshowApi from "@/apis/modules/slideshow.api.ts";
import SlideshowTable from "@/components/common/table/SlideshowTable";
import { Button } from "@/components/ui/button.jsx";
import Swal from 'sweetalert2';

const SlideshowManagerPage = () => {
    const [slideshows, setSlideshows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchSlideshows = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await SlideshowApi.list();
            if (res.status_code === 200) {
                setSlideshows(res.data?.data || []);
            } else {
                setError("Không thể tải danh sách slideshow");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải danh sách slideshow");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSlideshows(); }, []);

    const handleAdd = () => navigate("/admin/slideshows/add");
    const handleEdit = (slideshow) => navigate(`/admin/slideshows/edit/${slideshow.id}`);
    const handleDelete = async (slideshow) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn có chắc chắn muốn xóa slideshow này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const res = await SlideshowApi.delete(slideshow.id);
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
                        text: 'Đã xóa slideshow thành công'
                    });
                    fetchSlideshows();
                }
            } catch (err) {
                const apiError = err?.response?.data?.errors?.[0]?.message;
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: apiError || "Có lỗi xảy ra!"
                });
            }
        }
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Quản lý slideshow</h1>
            <div className="flex items-center justify-between mb-4">
                <Button
                    type="button"
                    className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2 "
                    onClick={handleAdd}
                >
                    <span className="text-lg">+</span> Thêm slideshow
                </Button>
            </div>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <SlideshowTable slideshows={slideshows} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default SlideshowManagerPage; 
