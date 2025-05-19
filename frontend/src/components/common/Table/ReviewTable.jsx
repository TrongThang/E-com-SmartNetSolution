import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenericTable from "@/components/common/GenericTable";
import { formatDate } from "@/utils/format";

const ReviewTable = ({ reviews, onView, onDelete }) => {
    const columns = [
        {
            key: "id",
            label: "ID",
            sortName: "id"
        },
        {
            key: "customer_name",
            label: "Khách hàng",
            render: (row) => `${row.surname} ${row.lastname}`
        },
        {
            key: "rating",
            label: "Đánh giá",
            sortName: "rating",
            render: (row) => `${row.rating}/5`
        },
        {
            key: "comment",
            label: "Bình luận",
            render: (row) => row.comment?.substring(0, 50) + (row.comment?.length > 50 ? "..." : "")
        },
        {
            key: "created_at",
            label: "Ngày đánh giá",
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
                        onClick={() => onView(row)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(row)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <GenericTable
            data={reviews}
            columns={columns}
            rowsPerPage={5}
        />
    );
};

export default ReviewTable;
