import { useEffect, useState } from "react";
import EmployeeApi from "@/apis/modules/employee.api.ts";
import EmployeesTable from "@/components/common/Table/EmployeeTable";

const EmployeeManagerPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
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

        fetchData();
    }, []);

    return (
        <div className="">
            <h1 className="text-xl font-bold mb-4 ">Quản lý nhân viên</h1>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <EmployeesTable employees={employees} />
            )}
        </div>
    );
};

export default EmployeeManagerPage;
