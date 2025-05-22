import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';

const UserTable = ({ users, onEdit, onDelete }) => {
    const columns = [
        {
            key: "sst",
            label: "STT",
            render: (_row, index) => index + 1,
        },
        {
            key: "image",
            label: "Hình ảnh",
            render: (row) => (
                <img
                    src={row.image}
                    alt={row.text_button}
                    className="w-32 h-20 object-cover rounded"
                />
            ),
        },
        {
            key: "fullname",
            label: "Tên người dùng",
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
            key: "gender",
            label: "Giới tính",
            render: (row) => (
                <span className={`px-2 py-1 rounded text-sm ${row.gender ===1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.gender === 1? 'Nam' : 'Nữ'}
                </span>
            ),
        },
        {
            key: "birthdate",
            label: "Ngày sinh",
            render: (row) => row.birthdate ? new Date(row.birthdate).toLocaleDateString('vi-VN') : '',
        },
        {
            key: "created_at",
            label: "Ngày tạo",
            render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : '',
        },
        {
            key: "updated_at",
            label: "Ngày cập nhật",
            render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString('vi-VN') : '',
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
            data={users}
            columns={columns}
        />
    );
};

export default UserTable; 