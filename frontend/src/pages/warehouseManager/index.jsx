import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WarehouseApi from "@/apis/modules/warehouse.api.ts";
import WarehouseTable from "@/components/common/Table/WarehouseTable";
import { Button } from "@/components/ui/button.jsx";
import Swal from 'sweetalert2';

const WarehouseManagerPage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchWarehouses = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await WarehouseApi.list();
            if (res.status_code === 200) {
                setWarehouses(res.data?.data || []);
            } else {
                setError("Không thể tải danh sách kho");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải danh sách kho");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWarehouses(); }, []);

    const handleAdd = () => navigate("/admin/warehouses/add");
    const handleEdit = (warehouse) => navigate(`/admin/warehouses/edit/${warehouse.id}`);
    const handleDelete = async (warehouse) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn có chắc chắn muốn xóa kho này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const res = await WarehouseApi.delete(warehouse.id);
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
                        text: 'Đã xóa kho thành công'
                    });
                    fetchWarehouses();
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
            <h1 className="text-xl font-bold mb-4">Quản lý kho</h1>
            <div className="flex items-center justify-between mb-4">
                <Button
                    type="button"
                    className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2 "
                    onClick={handleAdd}
                >
                    <span className="text-lg">+</span> Thêm kho
                </Button>
            </div>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <WarehouseTable warehouses={warehouses} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default WarehouseManagerPage; 