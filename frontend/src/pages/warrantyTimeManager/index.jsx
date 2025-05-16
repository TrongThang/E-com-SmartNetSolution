import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WarrantyTimeApi from "@/apis/modules/warrantyTime.api.ts";
import WarrantyTimeTable from "@/components/common/Table/WarrantyTimeTable";
import { Button } from "@/components/ui/button.jsx";
import Swal from 'sweetalert2';

const WarrantyTimeManagerPage = () => {
    const [warrantyTimes, setWarrantyTimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchWarrantyTimes = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await WarrantyTimeApi.list();
            if (res.status_code === 200) {
                setWarrantyTimes(res.data?.data || []);
            } else {
                setError("Không thể tải danh sách thời gian bảo hành");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải danh sách thời gian bảo hành");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWarrantyTimes(); }, []);

    const handleAdd = () => navigate("/admin/warranty-times/add");
    const handleEdit = (warrantyTime) => navigate(`/admin/warranty-times/edit/${warrantyTime.id}`);
    const handleDelete = async (warrantyTime) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn có chắc chắn muốn xóa thời gian bảo hành này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const res = await WarrantyTimeApi.delete(warrantyTime.id);
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
                        text: 'Đã xóa thời gian bảo hành thành công'
                    });
                    fetchWarrantyTimes();
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
            <h1 className="text-xl font-bold mb-4">Quản lý thời gian bảo hành</h1>
            <div className="flex items-center justify-between mb-4">
                <Button
                    type="button"
                    className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2 "
                    onClick={handleAdd}
                >
                    <span className="text-lg">+</span> Thêm thời gian bảo hành
                </Button>
            </div>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <WarrantyTimeTable warrantyTimes={warrantyTimes} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default WarrantyTimeManagerPage; 