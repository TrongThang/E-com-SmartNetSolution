import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';

const WarrantyTimeTable = ({ warrantyTimes, onEdit, onDelete }) => {
    const columns = [
        {
            key: "sst",
            label: "STT",
            render: (_row, index) => index + 1,
        },
        {
            key: "name",
            label: "Tên thời gian bảo hành",
            sortName: "name"
        },
        {
            key: "time",
            label: "Thời gian (tháng)",
            sortName: "time"
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
            data={warrantyTimes}
            columns={columns}
        />
    );
};

export default WarrantyTimeTable; 