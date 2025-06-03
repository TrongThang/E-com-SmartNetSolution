import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WarehouseApi from "@/apis/modules/warehouse.api.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Swal from 'sweetalert2';

const AddWarehouse = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await WarehouseApi.create({ name, address });
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
                    text: 'Đã thêm kho thành công'
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

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-4">Thêm kho</h2>
            <form onSubmit={handleSubmit}>
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
        </div>
    );
};

export default AddWarehouse; 