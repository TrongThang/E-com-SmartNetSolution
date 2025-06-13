import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react";
import addressBookApi from "@/apis/modules/address.api.ts";
import { toast } from "sonner";

export function NewAddressForm({ form }) {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
    const [isLoadingWards, setIsLoadingWards] = useState(false);

    useEffect(() => {
        fetchProvinces();
    }, []);

    const fetchProvinces = async () => {
        try {
            setIsLoadingProvinces(true);
            const res = await addressBookApi.getCity();
            console.log("Provinces:", res.data);
            setProvinces(res.data || []);
        } catch (error) {
            console.error("Error fetching provinces:", error);
            toast.error("Không thể tải danh sách tỉnh/thành phố");
        } finally {
            setIsLoadingProvinces(false);
        }
    };

    const fetchDistricts = async (provinceId) => {
        if (!provinceId) {
            setDistricts([]);
            setWards([]);
            return;
        }
        try {
            setIsLoadingDistricts(true);
            const res = await addressBookApi.getDistrict(provinceId);
            console.log("Districts:", res.data);
            setDistricts(res.data || []);
            setWards([]);
        } catch (error) {
            console.error("Error fetching districts:", error);
            toast.error("Không thể tải danh sách quận/huyện");
        } finally {
            setIsLoadingDistricts(false);
        }
    };

    const fetchWards = async (districtId) => {
        if (!districtId) {
            setWards([]);
            return;
        }
        try {
            setIsLoadingWards(true);
            const res = await addressBookApi.getWard(districtId);
            console.log("Wards:", res.data);
            setWards(res.data || []);
        } catch (error) {
            console.error("Error fetching wards:", error);
            toast.error("Không thể tải danh sách phường/xã");
        } finally {
            setIsLoadingWards(false);
        }
    };

    const handleProvinceChange = (provinceId) => {
        const selectedProvince = provinces.find(p => p.ProvinceID == provinceId);
        console.log("Selected Province:", selectedProvince, "Value:", provinceId);

        // Update form values
        form.setValue("city", selectedProvince?.ProvinceName || "");
        form.setValue("district", "");
        form.setValue("ward", "");

        // Fetch districts
        fetchDistricts(provinceId);
    };

    const handleDistrictChange = (districtId) => {
        const selectedDistrict = districts.find(d => d.DistrictID == districtId);
        console.log("Selected District:", selectedDistrict, "Value:", districtId);

        // Update form values
        form.setValue("district", selectedDistrict?.DistrictName || "");
        form.setValue("ward", "");

        // Fetch wards
        fetchWards(districtId);
    };

    const handleWardChange = (wardCode) => {
        const selectedWard = wards.find(w => w.WardCode == wardCode);
        console.log("Selected Ward:", selectedWard, "Value:", wardCode);

        // Update form values
        form.setValue("ward", selectedWard?.WardName || "");
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Họ tên người nhận</FormLabel>
                            <FormControl>
                                <Input placeholder="Nguyễn Văn A" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số điện thoại người nhận</FormLabel>
                            <FormControl>
                                <Input placeholder="0987654321" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="example@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                            <Input placeholder="123 Đường Nguyễn Văn Linh" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                            <FormControl>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={provinces.find(p => p.ProvinceName === field.value)?.ProvinceID || ""}
                                    onChange={(e) => {
                                        const provinceId = e.target.value;
                                        handleProvinceChange(provinceId);
                                    }}
                                    disabled={isLoadingProvinces}
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces.map((province) => (
                                        <option key={province.ProvinceID} value={province.ProvinceID}>
                                            {province.ProvinceName}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quận/Huyện</FormLabel>
                            <FormControl>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={districts.find(d => d.DistrictName === field.value)?.DistrictID || ""}
                                    onChange={(e) => {
                                        const districtId = e.target.value;
                                        handleDistrictChange(districtId);
                                    }}
                                    disabled={districts.length === 0 || isLoadingDistricts}
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.DistrictID} value={district.DistrictID}>
                                            {district.DistrictName}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ward"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phường/Xã</FormLabel>
                            <FormControl>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={wards.find(w => w.WardName === field.value)?.WardCode || ""}
                                    onChange={(e) => {
                                        const wardCode = e.target.value;
                                        handleWardChange(wardCode);
                                    }}
                                    disabled={wards.length === 0 || isLoadingWards}
                                >
                                    <option value="">Chọn phường/xã</option>
                                    {wards.map((ward) => (
                                        <option key={ward.WardCode} value={ward.WardCode}>
                                            {ward.WardName}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* <FormField
                control={form.control}
                name="saveInfo"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Lưu địa chỉ này vào sổ địa chỉ</FormLabel>
                        </div>
                    </FormItem>
                )}
            /> */}
        </div>
    )
}