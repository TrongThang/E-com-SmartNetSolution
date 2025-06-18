import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WarehouseApi from "@/apis/modules/warehouse.api.ts";
import addressBookApi from "@/apis/modules/address.api.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Swal from 'sweetalert2';

const AddWarehouse = () => {
    const [formData, setFormData] = useState({
        name: "",
        provinceId: "",
        provinceName: "",
        districtId: "",
        districtName: "",
        wardCode: "",
        wardName: "",
        street: "",
        detail: ""
    });
    const [formErrors, setFormErrors] = useState({
        name: "",
        provinceId: "",
        districtId: "",
        wardCode: "",
        street: "",
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProvinces();
    }, []);

    const fetchProvinces = async () => {
        try {
            const res = await addressBookApi.getCity();
            setProvinces(res.data || []);
        } catch (error) {
            setError("Không thể tải danh sách tỉnh/thành phố");
        }
    };

    const fetchDistricts = async (provinceId) => {
        if (!provinceId) {
            setDistricts([]);
            setWards([]);
            return;
        }
        try {
            const res = await addressBookApi.getDistrict(provinceId);
            setDistricts(res.data || []);
            setWards([]);
        } catch (error) {
            setError("Không thể tải danh sách quận/huyện");
        }
    };

    const fetchWards = async (districtId) => {
        if (!districtId) {
            setWards([]);
            return;
        }
        try {
            const res = await addressBookApi.getWard(districtId);
            setWards(res.data || []);
        } catch (error) {
            setError("Không thể tải danh sách phường/xã");
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        setFormErrors(prev => ({
            ...prev,
            [id]: ""
        }));

        if (id === 'provinceId') {
            const selectedProvince = provinces.find(p => p.ProvinceID === value);
            setFormData(prev => ({
                ...prev,
                provinceId: value,
                provinceName: selectedProvince?.ProvinceName || "",
                districtId: "",
                districtName: "",
                wardCode: "",
                wardName: ""
            }));
            fetchDistricts(value);
        } else if (id === 'districtId') {
            const selectedDistrict = districts.find(d => d.DistrictID === value);
            setFormData(prev => ({
                ...prev,
                districtId: value,
                districtName: selectedDistrict?.DistrictName || "",
                wardCode: "",
                wardName: ""
            }));
            fetchWards(value);
        } else if (id === 'wardCode') {
            const selectedWard = wards.find(w => w.WardCode === value);
            setFormData(prev => ({
                ...prev,
                wardCode: value,
                wardName: selectedWard?.WardName || ""
            }));
        }
    };

    const validateForm = () => {
        const errors = {
            name: "",
            provinceId: "",
            districtId: "",
            wardCode: "",
            street: "",
        };
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = "Tên kho là bắt buộc";
            isValid = false;
        }
        if (!formData.provinceId) {
            errors.provinceId = "Vui lòng chọn tỉnh/thành phố";
            isValid = false;
        }
        if (!formData.districtId) {
            errors.districtId = "Vui lòng chọn quận/huyện";
            isValid = false;
        }
        if (!formData.wardCode) {
            errors.wardCode = "Vui lòng chọn phường/xã";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!validateForm()) {
            setError("Vui lòng điền đầy đủ các trường bắt buộc");
            return;
        }
        setLoading(true);
        try {
            const res = await WarehouseApi.create({
                name: formData.name,
                address: formData.detail,
                province: formData.provinceId,
                district: formData.districtId,
                ward: formData.wardCode
            });
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
                        id="name"
                        className={`mb-2 ${formErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        placeholder="Nhập tên kho"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.name && (
                        <div className="text-red-500 text-xs">{formErrors.name}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm">Tỉnh/Thành phố<span className="text-red-500">*</span> :</label>
                    <select
                        id="provinceId"
                        className={`mb-2 border rounded p-2 w-full ${formErrors.provinceId ? 'border-red-500' : ''}`}
                        value={formData.provinceId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {provinces.map((province) => (
                            <option key={province.ProvinceID} value={province.ProvinceID}>
                                {province.ProvinceName}
                            </option>
                        ))}
                    </select>
                    {formErrors.provinceId && <div className="text-red-500 text-xs">{formErrors.provinceId}</div>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm">Quận/Huyện<span className="text-red-500">*</span> :</label>
                    <select
                        id="districtId"
                        className={`mb-2 border rounded p-2 w-full ${formErrors.districtId ? 'border-red-500' : ''}`}
                        value={formData.districtId}
                        onChange={handleInputChange}
                        required
                        disabled={districts.length === 0}
                    >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map((district) => (
                            <option key={district.DistrictID} value={district.DistrictID}>
                                {district.DistrictName}
                            </option>
                        ))}
                    </select>
                    {formErrors.districtId && <div className="text-red-500 text-xs">{formErrors.districtId}</div>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm">Phường/Xã<span className="text-red-500">*</span> :</label>
                    <select
                        id="wardCode"
                        className={`mb-2 border rounded p-2 w-full ${formErrors.wardCode ? 'border-red-500' : ''}`}
                        value={formData.wardCode}
                        onChange={handleInputChange}
                        required
                        disabled={wards.length === 0}
                    >
                        <option value="">Chọn phường/xã</option>
                        {wards.map((ward) => (
                            <option key={ward.WardCode} value={ward.WardCode}>
                                {ward.WardName}
                            </option>
                        ))}
                    </select>
                    {formErrors.wardCode && <div className="text-red-500 text-xs">{formErrors.wardCode}</div>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm">Chi tiết:</label>
                    <Input
                        id="detail"
                        className="mb-2"
                        placeholder="Số nhà, tòa nhà, v.v."
                        value={formData.detail}
                        onChange={handleInputChange}
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