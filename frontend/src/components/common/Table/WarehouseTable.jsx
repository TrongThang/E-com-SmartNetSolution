import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';

const WarehouseTable = ({ warehouses, onEdit, onDelete }) => {
    const columns = [
        {
            key: "sst",
            label: "STT",
            render: (_row, index) => index + 1,
        },
        {
            key: "name",
            label: "Tên kho",
            sortName: "name"
        },
        {
            key: "address",
            label: "Địa chỉ",
            sortName: "address"
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
            data={warehouses}
            columns={columns}
            rowsPerPage={5}
        />
    );
};

export default WarehouseTable; 