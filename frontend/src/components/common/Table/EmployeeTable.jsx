"use client"
import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';

const EmployeesTable = ({ employees, onEdit, onDelete }) => {
    const columns = [
        {
            key: "sst",
            label: "STT",
            render: (_row, index) => index + 1,
        },
        {
            key: "surname",
            label: "Họ",
        },
        {
            key: "lastname",
            label: "Tên",
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "phone",
            label: "Số điện thoại",
        },
        {
            key: "birthdate",
            label: "Ngày sinh",
            render: (row) => row.birthdate ? new Date(row.birthdate).toLocaleDateString('vi-VN') : '',
        },
        {
            key: "gender",
            label: "Giới tính",
            render: (row) => row.gender ? "Nam" : "Nữ",
        },
        {
            key: "image",
            label: "Hình ảnh",
            render: (row) => row.image ? <img src={row.image} alt={`${row.surname} ${row.lastname}`} className="w-16 h-16 object-cover" /> : '',
        },
        {
            key: "status",
            label: "Trạng thái",
            render: (row) => row.status === 1 ? "Hoạt động" : "Không hoạt động",
        },
        {
            key: "role_name",
            label: "Vai trò",
        },
        {
            key: "created_at",
            label: "Ngày tạo",
            render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : '',
        },
        {
            key: "actions",
            label: "Thao tác",
            render: (row) => (
                <ActionsColumn
                    row={row}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        },
    ];

    return (
        <GenericTable
            data={employees}
            columns={columns}
        />
    );
};

export default EmployeesTable;