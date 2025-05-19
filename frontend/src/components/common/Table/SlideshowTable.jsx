import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';

const SlideshowTable = ({ slideshows, onEdit, onDelete }) => {
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
            key: "text_button",
            label: "Nút",
            sortName: "text_button"
        },
        {
            key: "link",
            label: "Đường dẫn",
            sortName: "link"
        },
        {
            key: "status",
            label: "Trạng thái",
            sortName: "status",
            render: (row) => (
                <span className={`px-2 py-1 rounded text-sm ${row.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.status ? 'Hiển thị' : 'Ẩn'}
                </span>
            ),
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
            data={slideshows}
            columns={columns}
        />
    );
};

export default SlideshowTable; 