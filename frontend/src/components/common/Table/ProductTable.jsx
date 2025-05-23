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
                    alt={row.text_button}
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
            key: "views",
            label: "Lượt xem",
        },
        {
            key: "categories",
            label: "Danh mục",
        },
        {
            key: "status",
            label: "Trạng thái",
            render: (row) => (
                <span className={`px-2 py-1 rounded text-sm ${row.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.status ? 'Hiển thị' : 'Ẩn'}
                </span>
            ),
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