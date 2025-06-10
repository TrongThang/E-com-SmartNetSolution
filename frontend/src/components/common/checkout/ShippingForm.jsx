"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { SavedAddressForm } from "@/components/common/checkout/addressBook/SavedAddressForm"
import { NewAddressForm } from "@/components/common/checkout/addressBook/NewAddressForm"
import addressBookApi from "@/apis/modules/address.api.ts"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

const formSchema = z.object({
    addressType: z.enum(["new", "saved"]),
    savedAddressId: z.string().optional(),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    ward: z.string().optional(),
    shippingMethod: z.enum(["standard", "express"]),
    note: z.string().optional(),
})

export function ShippingForm({ onComplete }) {
    const [addressData, setAddressData] = useState({
        customer: null,
        address_books: []
    })
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        const fetchAddressBook = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(
                    'http://localhost:8081/api/address-book/customer/CUST5QL4N3FV51NLUY895SCRHZFV'
                )
                
                if (response.data.status_code === 200) {
                    setAddressData({
                        customer: response.data.data.data.customer,
                        address_books: response.data.data.data.address_books
                    })
                }
            } catch (error) {
                console.error('Error fetching address book:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAddressBook()
    }, [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            addressType: "saved",
            savedAddressId: "",
            fullName: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            district: "",
            ward: "",
            shippingMethod: "standard",
            note: "",
        },
    })

    useEffect(() => {
        if (addressData.address_books.length > 0) {
            const defaultId = String(
                addressData.address_books.find((addr) => addr.is_default)?.id ||
                addressData.address_books[0]?.id
            );

            console.log("defaultId:", defaultId)
            form.setValue("savedAddressId", defaultId);
        }
    }, [addressData]);

    const selectedAddressType = form.watch("addressType")
    const selectedAddressId = form.watch("savedAddressId")
    const selectedAddress = addressData.address_books.find(
        (addr) => String(addr.id) === String(selectedAddressId)
    );

    function onSubmit(values) {
        // Nếu chọn địa chỉ đã lưu
        if (selectedAddressType === "saved") {
            if (!values.savedAddressId) {
                form.setError("savedAddressId", { type: "manual", message: "Vui lòng chọn địa chỉ đã lưu" });
                return;
            }
            form.setValue("fullName", addressData.customer.name);
            form.setValue("phone", addressData.customer.phone);
            form.setValue("email", addressData.customer.email);
            form.setValue("city", selectedAddress.city);
            form.setValue("district", selectedAddress.district);
            form.setValue("ward", selectedAddress.ward);
            form.setValue("address", selectedAddress.detail);
            form.setValue("note", values.note);
            onComplete(form.getValues());
        }
        // Nếu nhập địa chỉ mới
        else if (selectedAddressType === "new") {
            if (!values.fullName || values.fullName.length < 2) {
                form.setError("fullName", { type: "manual", message: "Họ tên phải có ít nhất 2 ký tự" });
                return;
            }
            if (!values.phone || values.phone.length < 10) {
                form.setError("phone", { type: "manual", message: "Số điện thoại không hợp lệ" });
                return;
            }
            if (!values.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) {
                form.setError("email", { type: "manual", message: "Email không hợp lệ" });
                return;
            }
            if (!values.address || values.address.length < 5) {
                form.setError("address", { type: "manual", message: "Địa chỉ phải có ít nhất 5 ký tự" });
                return;
            }
            if (!values.city || values.city.length < 2) {
                form.setError("city", { type: "manual", message: "Vui lòng chọn tỉnh/thành phố" });
                return;
            }
            if (!values.district || values.district.length < 2) {
                form.setError("district", { type: "manual", message: "Vui lòng chọn quận/huyện" });
                return;
            }
            if (!values.ward || values.ward.length < 2) {
                form.setError("ward", { type: "manual", message: "Vui lòng chọn phường/xã" });
                return;
            }
            console.log("values:", values)  
            onComplete(values);
        }
    }

    const saveNewAddress = async (addressData) => {
        try {
            const createData = {
                customer_id: user.customer_id,
                receiver_name: addressData.fullName,
                phone: addressData.phone,
                city: addressData.city,
                district: addressData.district,
                ward: addressData.ward,
                street: addressData.address,
                detail: "",
                is_default: false
            };
            
            const res = await addressBookApi.add(createData);
            if (res.status_code === 201) {
                toast.success("Đã lưu địa chỉ mới vào sổ địa chỉ");
                return true;
            } else {
                toast.error("Không thể lưu địa chỉ mới");
                return false;
            }
        } catch (error) {
            console.error("Error saving new address:", error);
            toast.error("Đã xảy ra lỗi khi lưu địa chỉ");
            return false;
        }
    };

    if (isLoading) {
        return <div>Đang tải...</div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="addressType"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Chọn địa chỉ giao hàng</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="saved" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Chọn từ sổ địa chỉ</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="new" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Nhập địa chỉ mới</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {selectedAddressType === "saved" && (
                    <SavedAddressForm 
                        form={form} 
                        addressData={addressData} 
                        selectedAddress={selectedAddress} 
                    />
                )}

                {selectedAddressType === "new" && <NewAddressForm form={form} />}

                <FormField
                    control={form.control}
                    name="shippingMethod"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Phương thức vận chuyển</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="standard" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Giao hàng tiêu chuẩn (2-3 ngày) - 30,000 VNĐ</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="express" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Giao hàng nhanh (1-2 ngày) - 60,000 VNĐ</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ghi chú</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Tiếp tục
                </Button>
            </form>
        </Form>
    )
}