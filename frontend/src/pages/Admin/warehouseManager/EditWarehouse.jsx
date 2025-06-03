import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WarehouseApi from "@/apis/modules/warehouse.api.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Swal from 'sweetalert2';
import GenericTable from "@/components/common/GenericTable";
import { formatCurrency } from "@/utils/format";

const EditWarehouse = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        WarehouseApi.detail(Number(id)).then(res => {
            if (res.data) {
                setName(res.data.name || "");
                setAddress(res.data.address || "");
                setProducts(res.data.products || []);
            }
        }).catch(() => setError("Không tìm thấy kho!"));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await WarehouseApi.update({ id: Number(id), name, address });
            if (res.error && res.error !== 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: res.message || "Có lỗi xảy ra!"
                });
                setError(res.message || "Có lỗi xảy ra!");
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Đã cập nhật kho thành công'
                });
                navigate("/admin/warehouses");
            }
        } catch (err) {
            const apiError = err?.response?.data?.errors?.[0]?.message;
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: apiError || "Có lỗi xảy ra!"
            });
            setError(apiError || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    const productColumns = [
        {
            key: "sst",
            label: "STT",
            render: (_row, index) => index + 1,
        },
        {
            key: "name",
            label: "Tên sản phẩm",
        },
        {
            key: "quantity",
            label: "Số lượng",
        },
        {
            key: "import_price",
            label: "Giá nhập",
            render: (row) => formatCurrency(row.import_price),
        },
        {
            key: "selling_price",
            label: "Giá bán",
            render: (row) => formatCurrency(row.selling_price),
        },
    ];

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-4">Sửa kho</h2>
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                    <label className="block mb-1 text-sm">Tên kho<span className="text-red-500">*</span> :</label>
                    <Input
                        className={`mb-2 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        placeholder="Nhập tên kho"
                        value={name}
                        onChange={e => {
                            // Không cho nhập khoảng trắng đầu
                            if (e.target.value.length === 1 && e.target.value[0] === " ") return;
                            setName(e.target.value);
                        }}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm">Địa chỉ<span className="text-red-500">*</span> :</label>
                    <Input
                        className={`mb-2 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        placeholder="Nhập địa chỉ kho"
                        value={address}
                        onChange={e => {
                            // Không cho nhập khoảng trắng đầu
                            if (e.target.value.length === 1 && e.target.value[0] === " ") return;
                            setAddress(e.target.value);
                        }}
                        required
                    />
                </div>
                {error && (
                    <div className="text-red-500 mb-2 flex items-center gap-1">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" className="px-6 hover:opacity-70" onClick={() => navigate("/admin/warehouses")}>Hủy</Button>
                    <Button type="submit" className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2" disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu"}
                    </Button>
                </div>
            </form>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm trong kho</h3>
                {products.length > 0 ? (
                    <GenericTable
                        data={products}
                        columns={productColumns}
                    />
                ) : (
                    <p className="text-gray-500">Chưa có sản phẩm nào trong kho</p>
                )}
            </div>
        </div>
    );
};

export default EditWarehouse; 