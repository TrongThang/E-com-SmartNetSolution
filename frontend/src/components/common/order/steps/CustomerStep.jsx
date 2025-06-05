import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Step components
export default function CustomerStep({ orderData, setOrderData }) {
    const updateCustomer = (field, value) => {
        setOrderData((prev) => ({
            ...prev,
            customer: { ...prev.customer, [field]: value },
        }))
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="customer_name">Tên khách hàng *</Label>
                    <Input
                        id="customer_name"
                        value={orderData.customer.name}
                        onChange={(e) => updateCustomer("name", e.target.value)}
                        placeholder="Nhập tên khách hàng"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="customer_phone">Số điện thoại *</Label>
                    <Input
                        id="customer_phone"
                        value={orderData.customer.phone}
                        onChange={(e) => updateCustomer("phone", e.target.value)}
                        placeholder="Nhập số điện thoại"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="customer_email">Email</Label>
                    <Input
                        id="customer_email"
                        type="email"
                        value={orderData.customer.email}
                        onChange={(e) => updateCustomer("email", e.target.value)}
                        placeholder="Nhập email"
                    />
                </div>
            </div>
        </div>
    )
}