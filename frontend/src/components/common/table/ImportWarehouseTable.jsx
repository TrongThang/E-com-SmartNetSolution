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

const ImportWarehouseTable = ({ importWarehouse, onEdit, onDelete, onView }) => {
    const columns = [
        {
            key: "status",
            label: "Trạng thái",
            render: (row) => {
                switch (row.status) {
                    case 0:
                        return <Badge variant="outline" className="bg-yellow-500 text-white">Chờ xử lý</Badge>
                    case 1:
                        return <Badge variant="outline" className="bg-blue-500 text-white">Đang nhập</Badge>
                    case 2:
                        return <Badge variant="outline" className="bg-green-500 text-white">Hoàn thành</Badge>
                    default:
                        return <Badge variant="outline" className="bg-gray-500 text-white">Không xác định</Badge>
                }
            }
        },
        {
            key: "id",
            label: "Mã nhập kho",
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
            render: (row) => row.import_date ? formatDate(row.import_date) : '',
        },
        // {
        //     key: "total_money",
        //     label: "Tổng tiền",
        //     render: (row) => { return formatCurrency(Number(row.total_money)) },

        // },
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
                        onView={onView}
                    />
                </div>
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