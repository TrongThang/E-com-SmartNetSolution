import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';
import { formatCurrency, formatDate } from "@/utils/format";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ORDER_STATUS } from "@/constants/status.constants";
import { Badge } from "@/components/ui/badge";
import { Eye, FolderClock, Handshake, MapPinCheck, PackageSearch, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
const OrderTable = ({ orders, onEdit, onDelete, onView, selectedIds, setSelectedIds }) => {
    const rowPerPage = 10;

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(orders.map((order) => order.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const isAllSelected = orders.length > 0 && selectedIds.length === orders.length;

    const columns = [
        {
            key: "select",
            label: (
                <Input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                />
            ),
            render: (row) => {
                if(row.status === ORDER_STATUS.PENDING) {
                    return <Input
                                className="flex items-center justify-center"
                                type="checkbox"
                                checked={selectedIds.includes(row.id)}
                                onChange={() => toggleSelectOne(row.id)}
                            />
                }
            },
        },
        {
            key: "id",
            label: "Mã đặt hàng",
        },
        {
            key: "saler_name",
            label: "Người bán",
        },
        {
            key: "name_recipient",
            label: "Người nhận",
        },
        {
            key: "customer_name",
            label: "Người đặt",
        },
        {
            key: "address",
            label: "Địa chỉ",
        },
        {
            key: "phone",
            label: "SĐT",
        },
        {
            key: "amount",
            label: "Thành tiền",
            render: (row) => { return formatCurrency(Number(row.amount)) },
        },
        {
            key: "status",
            label: "Trạng thái",
            className: "w-[120px] whitespace-nowrap",
            render: (row) => (
                <span
                    className={`
                        px-2 py-1 rounded text-sm whitespace-nowrap min-w-[120px]
                        ${row.status === ORDER_STATUS.PENDING ? "bg-yellow-100 text-yellow-800" : 
                        row.status === ORDER_STATUS.PREPARING ? "bg-blue-100 text-blue-800" : 
                        row.status === ORDER_STATUS.SHIPPING ? "bg-green-100 text-green-800" : 
                        row.status === ORDER_STATUS.DELIVERED ? "bg-green-100 text-green-800" : 
                        row.status === ORDER_STATUS.COMPLETED ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    `}
                >
                    {
                        row.status === ORDER_STATUS.PENDING ? 
                            <Badge variant="outline"><FolderClock className="w-4 h-4 mr-2" /> Chờ xác nhận</Badge>
                        : 
                        row.status === ORDER_STATUS.PREPARING ? 
                            <Badge variant="outline"><PackageSearch className="w-4 h-4 mr-2" /> Đang chuẩn bị</Badge>
                        : 
                        row.status === ORDER_STATUS.SHIPPING ? 
                            <Badge variant="outline"><Truck className="w-4 h-4 mr-2" /> Đang giao</Badge>
                        : 
                        row.status === ORDER_STATUS.DELIVERED ? 
                            <Badge variant="outline"><Handshake className="w-4 h-4 mr-2" /> Đã giao</Badge>
                        : 
                        row.status === ORDER_STATUS.COMPLETED ? 
                            <Badge variant="outline"><MapPinCheck className="w-4 h-4 mr-2" /> Hoàn tất</Badge>
                        : 
                        <Badge variant="outline">Chưa xác định</Badge>
                    }
                </span>
            ),
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
                    <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white" size="icon" onClick={() => onView(row)}>
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
        <>
            <GenericTable
                data={orders}
                columns={columns}
                rowsPerPage={rowPerPage}
            />
        </>
    );
};

export default OrderTable; 