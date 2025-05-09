import GenericTable from "@/components/common/GenericTable";

const columns = [
    {
        key: "sst",
        label: "STT",
        render: (_row, index) => index + 1,
    },
    {
        key: "name",
        label: "Tên danh mục",
    },
    {
        key: "slug",
        label: "Slug",
    },
    {
        key: "parent_id",
        label: "Danh mục cha",
    },
    {
        key: "image",
        label: "Hình ảnh",
        render: (row) => <img src={row.image} alt={row.name} className="w-16 h-16" />,
    },
    {
        key: "description",
        label: "Mô tả",
    },
    {
        key: "attribute_groups",
        label: "Nhóm thuộc tính",
    },
    {
        key: "created_at",
        label: "Ngày tạo",
        sortName: "created_at",
    },
    {
        key: "is_hide",
        label: "Trạng thái Ẩn/Hiện",
        render: (row) => (row.is_hide ? "Ẩn" : "Hiện"),
    },
    {
        key: "actions",
        label: "Thao tác",
        render: (row) => (
            <div className="flex gap-2">
                <button
                    onClick={() => console.log("Edit", row)}
                    className="text-blue-500 hover:underline"
                >
                    Sửa
                </button>
                <button
                    onClick={() => console.log("Delete", row)}
                    className="text-red-500 hover:underline"
                >
                    Xóa
                </button>
            </div>
        ),
    },
];

const CategoriesTable = ({ categories }) => {
    return (
        <GenericTable
            data={categories}
            columns={columns}
        />
    );
};

export default CategoriesTable;
