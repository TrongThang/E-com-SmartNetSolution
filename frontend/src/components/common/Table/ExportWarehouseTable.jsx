import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';
import { formatCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const ExportWarehouseTable = ({ exportWarehouse, onEdit, onDelete, onView }) => {
    const columns = [
        {
            key: "id",
            label: "Mã xuất kho",
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
            key: "export_date",
            label: "Ngày xuất",
        },
        {
            key: "total_profit",
            label: "Tổng lợi nhuận",
            render: (row) => { return formatCurrency(Number(row.total_profit)) },

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
                <div className="flex items-center gap-2">
                    <Button onClick={() => onView(row)} variant="outline" size="icon">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <ActionsColumn
                        row={row}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            ),
        },
    ];

    return (
        <GenericTable
            data={exportWarehouse}
            columns={columns}
        />
    );
};

export default ExportWarehouseTable; 