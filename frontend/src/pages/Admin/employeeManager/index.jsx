import { useEffect, useState } from "react";
import EmployeeApi from "@/apis/modules/employee.api.ts";
import { useNavigate } from "react-router-dom";
import EmployeesTable from "@/components/common/table_e/EmployeeTable";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const EmployeeManagerPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await EmployeeApi.list({});
            if (res.status_code === 200) {
                setEmployees(res.data?.data || []);
            } else {
                setError("Không thể tải nhân viên");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải nhân viên");
            console.error("Failed to fetch employees", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAdd = () => navigate("/admin/employees/add");
    const handleEdit = (row) => navigate(`/admin/employees/edit/${row.id}`);
    const handleDelete = async (row) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn có chắc chắn muốn xóa nhân viên này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const res = await EmployeeApi.delete(row.id, false);
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
                        text: 'Đã xóa nhân viên thành công'
                    });
                    fetchEmployees();
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
    }
    return (
        <div className="">
            <h1 className="text-xl font-bold mb-4 ">Quản lý nhân viên</h1>
            <div className="flex items-center justify-between mb-4">
                <Button
                    type="button"
                    className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2 "
                    onClick={handleAdd}
                >
                    <span className="text-lg">+</span> Thêm nhân viên
                </Button>
            </div>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <EmployeesTable employees={employees} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default EmployeeManagerPage;
