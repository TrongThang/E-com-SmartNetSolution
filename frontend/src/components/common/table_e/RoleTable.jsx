// frontend/src/components/common/table/RoleTable.jsx
import { Eye, Pencil, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GenericTable from "@/components/common/GenericTable";
import { formatDate } from "@/utils/format";

const RoleTable = ({ roles, onModifyPermission, onDelete, onEdit }) => {
    const columns = [
        {
            key: "id",
            label: "ID",
            sortName: "id"
        },
        {
            key: "name",
            label: "Tên chức vụ",
            sortName: "name"
        },
        {
            key: "permissions",
            label: "Quyền",
            sortName: "permissions",
            render: (row) => {
                const permissions = row.permission_role

                return (
                    <div className="flex flex-wrap gap-1">
                        {permissions.length > 0 ? (
                            permissions.map((item, index) => (
                                <Badge
                                    key={item.permission.id || index}
                                    className="text-xs bg-blue-500 text-white   "
                                >
                                    {item.permission.name}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm">Không có quyền</span>
                        )}
                    </div>
                );
            }
        },
        {
            key: "created_at",
            label: "Ngày tạo",
            sortName: "created_at",
            render: (row) => formatDate(row.created_at)
        },
        {
            key: "actions",
            label: "Thao tác",
            render: (row) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-yellow-500 hover:bg-yellow-500 hover:text-white"
                        onClick={() => onEdit(row)}
                        title="Sửa chức vụ"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:bg-gray-500 hover:text-white"
                        onClick={() => onModifyPermission(row)}
                        title="Xem chi tiết"
                    >
                        <Shield className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => onDelete(row)}
                        title="Xóa chức vụ"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <GenericTable
            data={roles}
            columns={columns}
            rowsPerPage={5}
        />
    );
};

export default RoleTable;