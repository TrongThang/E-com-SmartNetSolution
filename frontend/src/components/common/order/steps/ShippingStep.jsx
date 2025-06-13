import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ShippingStep({ orderData, setOrderData }) {
    const updateShipping = (field, value) => {
        setOrderData((prev) => ({
            ...prev,
            shipping: { ...prev.shipping, [field]: value },
        }))
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin giao hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Tên người nhận *</Label>
                    <Input
                        value={orderData.shipping.name_recipient}
                        onChange={(e) => updateShipping("name_recipient", e.target.value)}
                        placeholder="Tên người nhận"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Số điện thoại *</Label>
                    <Input
                        value={orderData.shipping.phone}
                        onChange={(e) => updateShipping("phone", e.target.value)}
                        placeholder="Số điện thoại"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label>Địa chỉ *</Label>
                    <Input
                        value={orderData.shipping.address}
                        onChange={(e) => updateShipping("address", e.target.value)}
                        placeholder="Số nhà, tên đường"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Phường/Xã *</Label>
                    <Input
                        value={orderData.shipping.ward}
                        onChange={(e) => updateShipping("ward", e.target.value)}
                        placeholder="Phường/Xã"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Quận/Huyện *</Label>
                    <Input
                        value={orderData.shipping.district}
                        onChange={(e) => updateShipping("district", e.target.value)}
                        placeholder="Quận/Huyện"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Tỉnh/Thành phố *</Label>
                    <Input
                        value={orderData.shipping.city}
                        onChange={(e) => updateShipping("city", e.target.value)}
                        placeholder="Tỉnh/Thành phố"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Phương thức giao hàng</Label>
                    <Select
                        value={orderData.shipping.shippingMethod}
                        onValueChange={(value) => updateShipping("shippingMethod", value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="standard">Giao hàng tiêu chuẩn (30,000đ)</SelectItem>
                            <SelectItem value="express">Giao hàng nhanh (50,000đ)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}