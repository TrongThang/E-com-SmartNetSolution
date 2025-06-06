import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';
import { formatCurrency, formatDate } from "@/utils/format";

const ImportWarehouseTable = ({ importWarehouse, onEdit, onDelete }) => {
    const columns = [
        {
            key: "id",
            label: "Mã nhập kho",
        },
        {
            key: "file_authenticate",
            label: "File xác thực",
        },
        {
            key: "employee_name",
            label: "Nhân viên",
        },
        {
            key: "warehouse_name",
            label: "Kho",
        },
        {
            key: "import_date",
            label: "Ngày nhập",
        },
        {
            key: "total_money",
            label: "Tổng tiền",
            render: (row) => { return formatCurrency(Number(row.total_money)) },

        },
        {
            key: "note",
            label: "Ghi chú",
        },
        {
            key: "created_at",
            label: "Ngày tạo",
            render: (row) => row.created_at ? formatDate(row.created_at) : '',
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
            data={importWarehouse}
            columns={columns}
        />
    );
};

export default ImportWarehouseTable; 