import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';


const ProductTable = ({ products, onEdit, onDelete }) => {
    const columns = [
        {
            key: "sst",
            label: "STT",
            render: (_row, index) => index + 1,
        },
        {
            key: "image",
            label: "Hình ảnh",
            render: (row) => (
                <img
                    src={row.image}
                    alt={row.name}
                    className="w-32 h-20 object-cover rounded"
                />
            ),
        },
        {
            key: "name",
            label: "Tên sản phẩm",
        },
        {
            key: "description",
            label: "Mô tả",
        },
        {
            key: "selling_price",
            label: "Giá",
            render: (row) => { return Number(row.selling_price).toLocaleString('vi-VN') + 'đ'},
        },
        {
            key: "categories",
            label: "Danh mục",
        },
        {
            key: "status",
            label: "Trạng thái",
            render: (row) => {
                let statusClass = "";
                let statusLabel = "";
        
                switch (row.status) {
                    case -1:
                        statusClass = "bg-red-300 text-red-700";
                        statusLabel = "Ngừng bán";
                        break;
                    case 0:
                        statusClass = "bg-red-100 text-red-800";
                        statusLabel = "Hết hàng";
                        break;
                    case 1:
                        statusClass = "bg-green-100 text-green-800";
                        statusLabel = "Đang bán";
                        break;
                    case 2:
                        statusClass = "bg-yellow-100 text-yellow-800";
                        statusLabel = "Giảm giá";
                        break;
                    case 3:
                        statusClass = "bg-blue-100 text-blue-800";
                        statusLabel = "Nổi bật";
                        break;
                    case 4:
                        statusClass = "bg-purple-100 text-purple-800";
                        statusLabel = "Mới";
                        break;
                    default:
                        statusClass = "bg-gray-100 text-gray-800";
                        statusLabel = "Không xác định";
                }
        
                return (
                    <span
                        className={`px-2 py-1 rounded text-sm whitespace-nowrap ${statusClass}`}
                    >
                        {statusLabel}
                    </span>
                );
            },
        },
        {
            key: "created_at",
            label: "Ngày tạo",
            render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : '',
        },
        {
            key: "updated_at",
            label: "Ngày cập nhật",
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
            data={products}
            columns={columns}
        />
    );
};

export default ProductTable; 