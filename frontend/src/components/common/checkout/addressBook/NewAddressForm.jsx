import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export function NewAddressForm({ form }) {
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
                                <Input placeholder="TP. Hồ Chí Minh" {...field} />
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
                                <Input placeholder="Quận 7" {...field} />
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
                                <Input placeholder="Phường Tân Phong" {...field} />
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