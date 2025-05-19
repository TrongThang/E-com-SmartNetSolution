import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';

const UnitTable = ({ units, onEdit, onDelete }) => {
    const columns = [
        {
            key: "sst",
            label: "STT",
            render: (_row, index) => index + 1,
        },
        {
            key: "name",
            label: "Tên đơn vị tính",
            sortName: "name"
        },
        // {
        //     key: "created_at",
        //     label: "Ngày tạo",
        //     sortName: "created_at",
        //     render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : '',
        // },
        // {
        //     key: "updated_at",
        //     label: "Ngày cập nhật",
        //     sortName: "updated_at",
        //     render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString('vi-VN') : '',
        // },
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
            data={units}
            columns={columns}
        />
    );
};

export default UnitTable;
