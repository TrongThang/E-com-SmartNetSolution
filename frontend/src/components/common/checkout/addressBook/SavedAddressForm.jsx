import { Card, CardContent } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Phone } from "lucide-react"

export function SavedAddressForm({ form, addressData, selectedAddress }) {
    // Định dạng địa chỉ để hiển thị trong dropdown
    const formatAddressForSelect = (customer, address) => {
        return `${customer.name} | ${customer.phone} | ${customer.email} | ${address.detail}, ${address.ward}, ${address.district}, ${address.city}`
    }
    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="savedAddressId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Địa chỉ đã lưu</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder="Chọn địa chỉ"
                                    >
                                        {selectedAddress
                                            ? formatAddressForSelect(addressData.customer, selectedAddress)
                                            : "Chọn địa chỉ"}
                                    </SelectValue>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {addressData.address_books.map((address) => (
                                    <SelectItem key={address.id} value={address.id}>
                                        {formatAddressForSelect(addressData.customer, address)}
                                        {address.is_default === 1 && " (Mặc định)"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {selectedAddress && (
                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 border-b pb-2">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-lg">{addressData.customer?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 border-b pb-2">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{addressData.customer?.phone}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Email:</p>
                                <p>{addressData.customer?.email}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Địa chỉ giao hàng:</p>
                                <p className="font-medium">
                                    {selectedAddress.detail}, {selectedAddress.ward}, {selectedAddress.district},{" "}
                                    {selectedAddress.city}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}