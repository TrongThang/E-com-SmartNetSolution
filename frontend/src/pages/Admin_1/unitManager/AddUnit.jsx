import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UnitApi from "@/apis/modules/unit.api.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Swal from 'sweetalert2';

const AddUnit = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await UnitApi.create({ name });
            const isSuccessStatus = res.status_code && (
                (typeof res.status_code === "number" && res.status_code >= 200 && res.status_code < 300) ||
                (typeof res.status_code === "string" && res.status_code.startsWith("2"))
            );

            if (!isSuccessStatus || (res.errors && res.errors.length > 0)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: res.errors?.[0]?.message || res.message || "Có lỗi xảy ra!"
                });
                setError(res.errors?.[0]?.message || res.message || "Có lỗi xảy ra!");
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Đã thêm đơn vị tính thành công'
                });
                navigate("/admin/units");
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
            <h2 className="text-xl font-bold mb-4">Thêm đơn vị tính</h2>
            <form onSubmit={handleSubmit}>
                <label className="block mb-1 text-sm">Tên đơn vị tính<span className="text-red-500">*</span> :</label>
                <Input
                    className={`mb-2 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    placeholder="Nhập tên đơn vị tính"
                    value={name}
                    onChange={e => {
                        // Không cho nhập khoảng trắng đầu
                        if (e.target.value.length === 1 && e.target.value[0] === " ") return;
                        setName(e.target.value);
                    }}
                    required
                />
                {error && (
                    <div className="text-red-500 mb-2 flex items-center gap-1">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" className="px-6 hover:opacity-70" onClick={() => navigate("/admin/units")}>Hủy</Button>
                    <Button type="submit" className="px-6 bg-black text-white hover:opacity-70 flex items-center gap-2" disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddUnit;
