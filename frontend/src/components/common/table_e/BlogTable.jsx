import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';

const BlogTable = ({ blogs, onEdit, onDelete }) => {
    const columns = [
        {
            key: "sst",
            label: "STT",
            render: (_row, index) => index + 1,
        },
        {
            key: "category_name",
            label: "Tên danh mục",
            sortName: "category_name"
        },
        {
            key: "product_name",
            label: "Tên sản phẩm",
            sortName: "product_name"
        },
        {
            key: "author",
            label: "Tên tác giả",
            sortName: "author"
        },
        {
            key: "created_at",
            label: "Ngày đăng",
            sortName: "created_at",
            render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : '',
        },
        {
            key: "title",
            label: "Tiêu đề",
            sortName: "title"
        },
        {
            key: "content",
            label: "Nội dung ngắn",
            render: (row) => row.content ? row.content.replace(/<[^>]+>/g, '').slice(0, 80) + (row.content.length > 80 ? "..." : "") : ""
        },
        {
            key: "image",
            label: "Hình ảnh bài viết",
            render: (row) =>
                row.image ? (
                    <img
                        src={row.image.startsWith("data:") ? row.image : `data:image/jpeg;base64,${row.image}`}
                        alt="blog"
                        className="w-16 h-16 object-cover rounded"
                    />
                ) : (
                    <span className="text-gray-400">No Image</span>
                )
        },
        {
            key: "is_hide",
            label: "Trạng thái",
            render: (row) =>
                row.is_hide
                    ? <span className="text-red-600 font-semibold">Ẩn</span>
                    : <span className="text-green-600 font-semibold">Hiển thị</span>
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
            data={blogs}
            columns={columns}
            rowsPerPage={5}
        />
    );
};

export default BlogTable;
