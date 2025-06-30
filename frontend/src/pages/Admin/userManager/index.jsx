import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "@/components/common/Table/UserTable";
import { Button } from "@/components/ui/button.jsx";
import Swal from 'sweetalert2';
import customerApi from "@/apis/modules/customer.api.ts";

const UserManagerPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await customerApi.list();
            if (res.status_code === 200) {
                setUsers(res.data || []);
            } else {
                setError("Không thể tải danh sách người dùng");
            }

        } catch (err) {
            console.error("Lỗi API:", err);
            setError("Đã xảy ra lỗi khi tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleAdd = () => navigate("/admin/customers/add");
    const handleEdit = (user) => navigate(`/admin/customers/edit/${user.id}`);
    const handleDelete = async (user) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn có chắc chắn muốn xóa người dùng này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const res = await customerApi.delete(user.id);
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
                        text: 'Đã xóa khách hàng thành công'
                    });
                    fetchUsers();
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
            <h1 className="text-xl font-bold mb-4">Quản lý người dùng</h1>
            <div className="flex items-center justify-between mb-4">
                <Button
                    type="button"
                    className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2 "
                    onClick={handleAdd}
                >
                    <span className="text-lg">+</span> Thêm người dùng
                </Button>
            </div>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default UserManagerPage; 
