import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';
import { formatCurrency, formatDate } from "@/utils/format";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ORDER_STATUS } from "@/constants/status.constants";
import { Badge } from "@/components/ui/badge";
import { CheckCheckIcon, CheckCircle, Eye, FolderClock, Handshake, MapPinCheck, PackageSearch, Truck } from "lucide-react";
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
            prev?.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const getRowClassName = (row) => {
        switch (row.status) {
            case ORDER_STATUS.DELIVERED:
            case ORDER_STATUS.COMPLETED:
                return "bg-green-50 hover:bg-green-100"; // Xanh nhẹ cho đơn đã giao/hoàn thành
            case ORDER_STATUS.CANCELLED:
                return "bg-red-50 hover:bg-red-100"; // Đỏ nhẹ cho đơn đã hủy
            case ORDER_STATUS.SHIPPING:
                return "bg-blue-50 hover:bg-blue-100"; // Xanh dương nhẹ cho đơn đang giao
            case ORDER_STATUS.PREPARING:
                return "bg-yellow-50 hover:bg-yellow-100"; // Vàng nhẹ cho đơn đang chuẩn bị
            case ORDER_STATUS.PENDING:
                return "bg-orange-50 hover:bg-orange-100"; // Cam nhẹ cho đơn chờ xác nhận
            case ORDER_STATUS.PENDING_PAYMENT:
                return "bg-purple-50 hover:bg-purple-100"; // Tím nhẹ cho đơn chờ thanh toán
            case ORDER_STATUS.PENDING_SHIPPING:
                return "bg-indigo-50 hover:bg-indigo-100"; // Chàm nhẹ cho đơn chờ giao
            default:
                return "hover:bg-gray-50"; // Màu mặc định
        }
    };

    const isAllSelected = orders.length > 0 && selectedIds?.length === orders.length;

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
                if(row.status === ORDER_STATUS.PENDING_SHIPPING || row.status === ORDER_STATUS.PENDING || row.status === ORDER_STATUS.PREPARING) {
                    return (
                        <Input
                            className="flex items-center justify-center"
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            onChange={() => toggleSelectOne(row.id)}
                        />  
                    )
                } else {
                    return <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                }
            },
        },
        {
            key: "status",
            label: "Trạng thái",
            className: "w-[120px] whitespace-nowrap",
            render: (row) => (
                <span
                    className={`
                        px-2 py-1 rounded text-sm whitespace-nowrap min-w-[120px]
                        ${row.status === ORDER_STATUS.PENDING_PAYMENT ? "bg-rose-100 text-rose-800" : 
                        row.status === ORDER_STATUS.PENDING ? "bg-yellow-100 text-yellow-800" : 
                        row.status === ORDER_STATUS.PREPARING ? "bg-blue-100 text-blue-800" : 
                        row.status === ORDER_STATUS.PENDING_SHIPPING ? "bg-purple-100 text-purple-800" : 
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
                        row.status === ORDER_STATUS.PENDING_PAYMENT ? 
                            <Badge variant="outline"><Handshake className="w-4 h-4 mr-2" /> Chờ thanh toán</Badge>
                        : 
                        row.status === ORDER_STATUS.PENDING_SHIPPING ? 
                            <Badge variant="outline"><Truck className="w-4 h-4 mr-2" /> Chờ giao hàng</Badge>
                        : 
                        <Badge variant="outline">Chưa xác định</Badge>
                    }
                </span>
            ),
        },
        {
            key: "id",
            label: "Mã đặt hàng",
        },
        {
            key: "shipper_name",
            label: "Nhân viên giao hàng",
        },
        {
            key: "name_recipient",
            label: "Người nhận",
        },
        // {
        //     key: "customer_name",
        //     label: "Người đặt",
        // },
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
                getRowClassName={getRowClassName}
            />
        </>
    );
};

export default OrderTable; 