import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UnitApi from "@/apis/modules/unit.api.ts";
import UnitTable from "@/components/common/table/UnitTable";
import { Button } from "@/components/ui/button.jsx";
import Swal from 'sweetalert2';


const UnitManagerPage = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUnits = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await UnitApi.list();
            if (res.status_code === 200) {
                setUnits(res.data?.data || []);
            } else {
                setError("Không thể tải đơn vị tính");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải đơn vị tính");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUnits(); }, []);

    const handleAdd = () => navigate("/admin/units/add");
    const handleEdit = (unit) => navigate(`/admin/units/edit/${unit.id}`);
    const handleDelete = async (unit) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn có chắc chắn muốn xóa đơn vị tính này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const res = await UnitApi.delete(unit.id);
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
                        text: 'Đã xóa đơn vị tính thành công'
                    });
                    fetchUnits();
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
            <h1 className="text-xl font-bold mb-4">Quản lý đơn vị tính</h1>
            <div className="flex items-center justify-between mb-4">


                <Button
                    type="button"
                    className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2 "
                    onClick={handleAdd}
                >
                    <span className="text-lg">+</span> Thêm đơn vị tính
                </Button>
            </div>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <UnitTable units={units} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default UnitManagerPage;
