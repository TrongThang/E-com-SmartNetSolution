import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';
import { formatCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATUS = {
    0: "Chờ xử lý",
    1: "Đang xử lý",
    2: "Hoàn thành",
}

const ExportWarehouseTable = ({ exportWarehouse, onEdit, onDelete, onView }) => {
    const columns = [
        {
            key: "status",
            label: "Trạng thái",
            render: (row) => {
                switch (row.status) {
                    case 0:
                        return <Badge variant="outline" className="bg-yellow-500 text-white">Chờ xử lý</Badge>
                    case 1:
                        return <Badge variant="outline" className="bg-blue-500 text-white">Đang xuất</Badge>
                    case 2:
                        return <Badge variant="outline" className="bg-green-500 text-white">Hoàn thành</Badge>
                    default:
                        return <Badge variant="outline" className="bg-gray-500 text-white">Không xác định</Badge>
                }
            }
        },
        {
            key: "id",
            label: "Mã xuất kho",
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
            render: (row) => row.export_date ? formatDate(row.export_date) : '',
        },
        // {
        //     key: "total_profit",
        //     label: "Tổng lợi nhuận",
        //     render: (row) => { return formatCurrency(Number(row.total_profit)) },

        // },
        {
            key: "note",
            label: "Ghi chú",
            render: (row) => row.note ? row.note : 'Không có',
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