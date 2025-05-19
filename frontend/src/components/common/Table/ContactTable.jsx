import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';

const statusMap = {
    0: "Huỷ liên hệ",
    1: "Đang xem xét",
    2: "Gửi hợp đồng",
    3: "Đã ký hợp đồng",
};

const ContactTable = ({ contacts, onEdit, onDelete }) => {
    const columns = [
        {
            key: "sst",
            label: "STT",
            render: (_row, index) => index + 1,
        },
        {
            key: "fullname",
            label: "Họ tên",
            sortName: "fullname"
        },
        {
            key: "email",
            label: "Email",
            sortName: "email"
        },
        {
            key: "title",
            label: "Tiêu đề",
            sortName: "title"
        },
        {
            key: "content",
            label: "Nội dung",
            sortName: "content",
            render: (row) => row.content.length > 50 ? row.content.slice(0, 50) + "..." : row.content,
        },
        {
            key: "created_at",
            label: "Ngày tạo",
            sortName: "created_at",
            render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : '',
        },
        {
            key: "updated_at",
            label: "Ngày cập nhật",
            sortName: "updated_at",
            render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString('vi-VN') : '',
        },
        {
            key: "status",
            label: "Trạng thái",
            sortName: "status",
            render: (row) => (
                <span className={`px-2 py-1 rounded text-sm ${row.status === 0 ? 'bg-red-100 text-red-800' :
                    row.status === 1 ? 'bg-yellow-100 text-yellow-800' :
                        row.status === 2 ? 'bg-blue-100 text-blue-800' :
                            row.status === 3 ? 'bg-green-100 text-green-800' : ''
                    }`}>
                    {statusMap[row.status] || ""}
                </span>
            ),
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
            data={contacts}
            columns={columns}
            rowsPerPage={5}
        />
    );
};

export default ContactTable;
