import addressBookApi from "@/apis/modules/address.api.ts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/AuthContext"
import { Home, MapPin, Plus, Edit, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"; 

export default function AddressesPage() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isDialogLoading, setIsDialogLoading] = useState(false);
    const [formData, setFormData] = useState({
        receiver_name: "",
        phone: "",
        provinceId: "",
        provinceName: "",
        districtId: "",
        districtName: "",
        wardCode: "",
        wardName: "",
        street: "",
        detail: "",
        is_default: false
    });
    const [formErrors, setFormErrors] = useState({
        receiver_name: "",
        phone: "",
        provinceId: "",
        districtId: "",
        wardCode: "",
        street: "",
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await addressBookApi.getById("CUST001");
            console.log("Addresses:", res.data.data.address_books); // Debug
            if (res.status_code === 200) {
                setAddresses(res?.data?.data?.address_books || []);
            } else {
                setError("Không thể tải địa chỉ");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải địa chỉ");
            console.error("Failed to fetch addressBook", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProvinces = async () => {
        try {
            const res = await addressBookApi.getCity();
            console.log("Provinces:", res.data);
            setProvinces(res.data || []);
        } catch (error) {
            console.error("Error fetching provinces:", error);
            toast.error("Không thể tải danh sách tỉnh/thành phố");
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
            console.log("Districts:", res.data);
            setDistricts(res.data || []);
            setWards([]);
        } catch (error) {
            console.error("Error fetching districts:", error);
            toast.error("Không thể tải danh sách quận/huyện");
        }
    };

    const fetchWards = async (districtId) => {
        if (!districtId) {
            setWards([]);
            return;
        }
        try {
            const res = await addressBookApi.getWard(districtId);
            console.log("Wards:", res.data);
            setWards(res.data || []);
        } catch (error) {
            console.error("Error fetching wards:", error);
            toast.error("Không thể tải danh sách phường/xã");
        }
    };

    useEffect(() => {
        fetchData();
        fetchProvinces();
    }, []);

    const validateForm = () => {
        const errors = {
            receiver_name: "",
            phone: "",
            provinceId: "",
            districtId: "",
            wardCode: "",
            street: "",
        };
        let isValid = true;

        if (!formData.receiver_name.trim()) {
            errors.receiver_name = "Tên người nhận là bắt buộc";
            isValid = false;
        }
        if (!formData.phone.trim()) {
            errors.phone = "Số điện thoại là bắt buộc";
            isValid = false;
        } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone.trim())) {
            errors.phone = "Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09)";
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
        if (!formData.street.trim()) {
            errors.street = "Đường là bắt buộc";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
        setFormErrors(prev => ({
            ...prev,
            [id]: ""
        }));

        if (id === 'provinceId') {
            const selectedProvince = provinces.find(p => p.ProvinceID == value);
            console.log("Selected Province:", selectedProvince, "Value:", value);
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
            const selectedDistrict = districts.find(d => d.DistrictID == value);
            console.log("Selected District:", selectedDistrict, "Value:", value);
            setFormData(prev => ({
                ...prev,
                districtId: value,
                districtName: selectedDistrict?.DistrictName || "",
                wardCode: "",
                wardName: ""
            }));
            fetchWards(value);
        } else if (id === 'wardCode') {
            const selectedWard = wards.find(w => w.WardCode == value);
            console.log("Selected Ward:", selectedWard, "Value:", value);
            setFormData(prev => ({
                ...prev,
                wardCode: value,
                wardName: selectedWard?.WardName || ""
            }));
        }
    };

    const prepareUpdateData = async (address) => {
        setIsDialogLoading(true);
        try {
            let provinceId = address.provinceId ? String(address.provinceId) : "";
            let districtId = address.districtId ? String(address.districtId) : "";
            let wardCode = address.wardCode ? String(address.wardCode) : "";

            // Nếu không có provinceId, tìm từ city
            if (!provinceId && address.city) {
                const res = await addressBookApi.getCity();
                const province = res.data.find(p => p.ProvinceName === address.city);
                provinceId = province ? String(province.ProvinceID) : "";
            }

            // Nếu không có districtId, tìm từ district
            if (!districtId && address.district && provinceId) {
                const res = await addressBookApi.getDistrict(provinceId);
                const district = res.data.find(d => d.DistrictName === address.district);
                districtId = district ? String(district.DistrictID) : "";
            }

            // Nếu không có wardCode, tìm từ ward
            if (!wardCode && address.ward && districtId) {
                const res = await addressBookApi.getWard(districtId);
                const ward = res.data.find(w => w.WardName === address.ward);
                wardCode = ward ? String(ward.WardCode) : "";
            }

            // Cập nhật formData
            setFormData({
                receiver_name: address.receiver_name || "",
                phone: address.phone || "",
                provinceId: provinceId,
                provinceName: address.city || "",
                districtId: districtId,
                districtName: address.district || "",
                wardCode: wardCode,
                wardName: address.ward || "",
                street: address.street || "",
                detail: address.detail || "",
                is_default: !!address.is_default
            });

            // Tải danh sách quận/huyện và phường/xã
            if (provinceId) {
                await fetchDistricts(provinceId);
            }
            if (districtId) {
                await fetchWards(districtId);
            }

            console.log("Prepared FormData:", {
                provinceId,
                districtId,
                wardCode,
                formData
            });
        } catch (error) {
            console.error("Error preparing update data:", error);
            toast.error("Không thể tải dữ liệu địa chỉ");
        } finally {
            setIsDialogLoading(false);
        }

        setFormErrors({
            receiver_name: "",
            phone: "",
            provinceId: "",
            districtId: "",
            wardCode: "",
            street: "",
        });
    };

    const updateAddress = async (addressId) => {
        if (!validateForm()) {
            toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
            return;
        }
        try {
            const updateData = {
                id: addressId,
                customer_id: "CUST001",
                receiver_name: formData.receiver_name,
                phone: formData.phone,
                city: formData.provinceName,
                district: formData.districtName,
                ward: formData.wardName,
                street: formData.street,
                detail: formData.detail,
                is_default: formData.is_default
            };
            console.log("Update Data:", updateData);
            const res = await addressBookApi.edit(updateData);
            if (res.status_code === 200) {
                toast.success("Cập nhật địa chỉ thành công");
                setEditingId(null);
                resetFormData();
                await fetchData();
            } else {
                toast.error(res?.data?.message || "Cập nhật địa chỉ thất bại");
            }
        } catch (error) {
            console.error("Error updating address:", error);
            toast.error("Đã xảy ra lỗi khi cập nhật địa chỉ");
        }
    };

    const resetFormData = () => {
        setFormData({
            receiver_name: "",
            phone: "",
            provinceId: "",
            provinceName: "",
            districtId: "",
            districtName: "",
            wardCode: "",
            wardName: "",
            street: "",
            detail: "",
            is_default: false
        });
        setDistricts([]);
        setWards([]);
        setFormErrors({
            receiver_name: "",
            phone: "",
            provinceId: "",
            districtId: "",
            wardCode: "",
            street: "",
        });
    };

    const createAddress = async () => {
        if (!validateForm()) {
            toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
            return;
        }
        try {
            const createData = {
                customer_id: "CUST001",
                receiver_name: formData.receiver_name,
                phone: formData.phone,
                city: formData.provinceName,
                district: formData.districtName,
                ward: formData.wardName,
                street: formData.street,
                detail: formData.detail,
                is_default: formData.is_default
            };
            console.log("Create Data:", createData);
            const res = await addressBookApi.add(createData);
            if (res.status_code === 201) {
                toast.success("Thêm địa chỉ mới thành công");
                setIsCreating(false);
                resetFormData();
                await fetchData();
            } else {
                toast.error(res?.data?.message || "Thêm địa chỉ thất bại");
            }
        } catch (error) {
            console.error("Error creating address:", error);
            toast.error("Đã xảy ra lỗi khi thêm địa chỉ");
        }
    };

    const deleteAddress = async (customer_id, id) => {
        try {
            const res = await addressBookApi.delete(customer_id, id);
            if (res.status_code === 200) {
                toast.success("Xóa địa chỉ thành công");
                await fetchData();
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            toast.error("Đã xảy ra lỗi khi xóa địa chỉ");
        }
    };

    return (
        <>
            {(loading || !error) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Địa chỉ của tôi</CardTitle>
                        <CardDescription>Quản lý địa chỉ giao hàng và thanh toán</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog
                                open={isCreating}
                                onOpenChange={(open) => {
                                    if (!open) {
                                        setIsCreating(false);
                                        resetFormData();
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button onClick={() => setIsCreating(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm địa chỉ mới
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                                    </DialogHeader>
                                    {isDialogLoading ? (
                                        <div className="text-center py-4">Đang tải dữ liệu...</div>
                                    ) : (
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="receiver_name" className="text-right">Tên người nhận</Label>
                                                <div className="col-span-3">
                                                    <Input
                                                        id="receiver_name"
                                                        className={`col-span-3 ${formErrors.receiver_name ? 'border-red-500' : ''}`}
                                                        value={formData.receiver_name}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                    {formErrors.receiver_name && (
                                                        <p className="text-red-500 text-xs mt-1">{formErrors.receiver_name}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="phone" className="text-right">Số điện thoại</Label>
                                                <div className="col-span-3">
                                                    <Input
                                                        id="phone"
                                                        className={`col-span-3 ${formErrors.phone ? 'border-red-500' : ''}`}
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        required
                                                        type="tel"
                                                    />
                                                    {formErrors.phone && (
                                                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="provinceId" className="text-right">Tỉnh/Thành phố</Label>
                                                <div className="col-span-3">
                                                    <select
                                                        id="provinceId"
                                                        className={`col-span-3 border rounded p-2 ${formErrors.provinceId ? 'border-red-500' : ''}`}
                                                        value={formData.provinceId}
                                                        onChange={handleInputChange}
                                                        disabled={provinces.length === 0}
                                                        required
                                                    >
                                                        <option value="">Chọn tỉnh/thành phố</option>
                                                        {provinces.map((province) => (
                                                            <option key={province.ProvinceID} value={province.ProvinceID}>
                                                                {province.ProvinceName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {formErrors.provinceId && (
                                                        <p className="text-red-500 text-xs mt-1">{formErrors.provinceId}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="districtId" className="text-right">Quận/Huyện</Label>
                                                <div className="col-span-3">
                                                    <select
                                                        id="districtId"
                                                        className={`col-span-3 border rounded p-2 ${formErrors.districtId ? 'border-red-500' : ''}`}
                                                        value={formData.districtId}
                                                        onChange={handleInputChange}
                                                        disabled={districts.length === 0}
                                                        required
                                                    >
                                                        <option value="">Chọn quận/huyện</option>
                                                        {districts.map((district) => (
                                                            <option key={district.DistrictID} value={district.DistrictID}>
                                                                {district.DistrictName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {formErrors.districtId && (
                                                        <p className="text-red-500 text-xs mt-1">{formErrors.districtId}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="wardCode" className="text-right">Phường/Xã</Label>
                                                <div className="col-span-3">
                                                    <select
                                                        id="wardCode"
                                                        className={`col-span-3 border rounded p-2 ${formErrors.wardCode ? 'border-red-500' : ''}`}
                                                        value={formData.wardCode}
                                                        onChange={handleInputChange}
                                                        disabled={wards.length === 0}
                                                        required
                                                    >
                                                        <option value="">Chọn phường/xã</option>
                                                        {wards.map((ward) => (
                                                            <option key={ward.WardCode} value={ward.WardCode}>
                                                                {ward.WardName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {formErrors.wardCode && (
                                                        <p className="text-red-500 text-xs mt-1">{formErrors.wardCode}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="street" className="text-right">Đường</Label>
                                                <div className="col-span-3">
                                                    <Input
                                                        id="street"
                                                        className={`col-span-3 ${formErrors.street ? 'border-red-500' : ''}`}
                                                        value={formData.street}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                    {formErrors.street && (
                                                        <p className="text-red-500 text-xs mt-1">{formErrors.street}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="detail" className="text-right">Chi tiết</Label>
                                                <Input
                                                    id="detail"
                                                    className="col-span-3"
                                                    value={formData.detail}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <div></div>
                                                <div className="col-span-3 flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="is_default"
                                                        checked={formData.is_default}
                                                        onChange={handleInputChange}
                                                        className="h-4 w-4 rounded border-gray-300"
                                                    />
                                                    <Label htmlFor="is_default">Đặt làm địa chỉ mặc định</Label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <DialogFooter>
                                        <Button onClick={createAddress} disabled={isDialogLoading}>Lưu địa chỉ</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <div key={address.id} className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Home className="h-5 w-5 text-primary" />
                                            {address.is_default && (
                                                <span className="ml-2 rounded-full bg-[#0f0]/40 px-2 py-0.5 text-xs font-medium text-primary">
                                                    Mặc định
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Dialog
                                                open={editingId === address.id}
                                                onOpenChange={(open) => {
                                                    if (!open) {
                                                        setEditingId(null);
                                                        resetFormData();
                                                    }
                                                }}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={async () => {
                                                            setEditingId(address.id);
                                                            await prepareUpdateData(address);
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Cập nhật địa chỉ</DialogTitle>
                                                    </DialogHeader>
                                                    {isDialogLoading ? (
                                                        <div className="text-center py-4">Đang tải dữ liệu...</div>
                                                    ) : (
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="receiver_name" className="text-right">Tên người nhận</Label>
                                                                <div className="col-span-3">
                                                                    <Input
                                                                        id="receiver_name"
                                                                        className={`col-span-3 ${formErrors.receiver_name ? 'border-red-500' : ''}`}
                                                                        value={formData.receiver_name}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                    />
                                                                    {formErrors.receiver_name && (
                                                                        <p className="text-red-500 text-xs mt-1">{formErrors.receiver_name}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="phone" className="text-right">Số điện thoại</Label>
                                                                <div className="col-span-3">
                                                                    <Input
                                                                        id="phone"
                                                                        className={`col-span-3 ${formErrors.phone ? 'border-red-500' : ''}`}
                                                                        value={formData.phone}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                        type="tel"
                                                                    />
                                                                    {formErrors.phone && (
                                                                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="provinceId" className="text-right">Tỉnh/Thành phố</Label>
                                                                <div className="col-span-3">
                                                                    <select
                                                                        id="provinceId"
                                                                        className={`col-span-3 border rounded p-2 ${formErrors.provinceId ? 'border-red-500' : ''}`}
                                                                        value={formData.provinceId}
                                                                        onChange={handleInputChange}
                                                                        disabled={provinces.length === 0}
                                                                        required
                                                                    >
                                                                        <option value="">Chọn tỉnh/thành phố</option>
                                                                        {provinces.map((province) => (
                                                                            <option key={province.ProvinceID} value={province.ProvinceID}>
                                                                                {province.ProvinceName}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    {formErrors.provinceId && (
                                                                        <p className="text-red-500 text-xs mt-1">{formErrors.provinceId}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="districtId" className="text-right">Quận/Huyện</Label>
                                                                <div className="col-span-3">
                                                                    <select
                                                                        id="districtId"
                                                                        className={`col-span-3 border rounded p-2 ${formErrors.districtId ? 'border-red-500' : ''}`}
                                                                        value={formData.districtId}
                                                                        onChange={handleInputChange}
                                                                        disabled={districts.length === 0}
                                                                        required
                                                                    >
                                                                        <option value="">Chọn quận/huyện</option>
                                                                        {districts.map((district) => (
                                                                            <option key={district.DistrictID} value={district.DistrictID}>
                                                                                {district.DistrictName}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    {formErrors.districtId && (
                                                                        <p className="text-red-500 text-xs mt-1">{formErrors.districtId}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="wardCode" className="text-right">Phường/Xã</Label>
                                                                <div className="col-span-3">
                                                                    <select
                                                                        id="wardCode"
                                                                        className={`col-span-3 border rounded p-2 ${formErrors.wardCode ? 'border-red-500' : ''}`}
                                                                        value={formData.wardCode}
                                                                        onChange={handleInputChange}
                                                                        disabled={wards.length === 0}
                                                                        required
                                                                    >
                                                                        <option value="">Chọn phường/xã</option>
                                                                        {wards.map((ward) => (
                                                                            <option key={ward.WardCode} value={ward.WardCode}>
                                                                                {ward.WardName}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    {formErrors.wardCode && (
                                                                        <p className="text-red-500 text-xs mt-1">{formErrors.wardCode}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="street" className="text-right">Đường</Label>
                                                                <div className="col-span-3">
                                                                    <Input
                                                                        id="street"
                                                                        className={`col-span-3 ${formErrors.street ? 'border-red-500' : ''}`}
                                                                        value={formData.street}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                    />
                                                                    {formErrors.street && (
                                                                        <p className="text-red-500 text-xs mt-1">{formErrors.street}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="detail" className="text-right">Chi tiết</Label>
                                                                <Input
                                                                    id="detail"
                                                                    className="col-span-3"
                                                                    value={formData.detail}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <div></div>
                                                                <div className="col-span-3 flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="is_default"
                                                                        checked={formData.is_default}
                                                                        onChange={handleInputChange}
                                                                        className="h-4 w-4 rounded border-gray-300"
                                                                    />
                                                                    <Label htmlFor="is_default">Đặt làm địa chỉ mặc định</Label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <DialogFooter>
                                                        <Button onClick={() => updateAddress(address.id)} disabled={isDialogLoading}>
                                                            Lưu thay đổi
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="sm">
                                                <Trash className="h-4 w-4 text-red-500" onClick={() => deleteAddress("CUST001", address.id)} />
                                            </Button>
                                        </div>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="space-y-1">
                                        <div className="font-medium">
                                            {address.receiver_name} | {address.phone}
                                        </div>
                                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>
                                                {address.detail ? `${address.detail}, ` : ''}{address.street}, {address.ward}, {address.district}, {address.city}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}