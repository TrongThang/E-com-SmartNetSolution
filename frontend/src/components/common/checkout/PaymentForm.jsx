"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CreditCard, Landmark, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import VNPayLogo from "@/assets/images/logo/v-vnpay-svgrepo-com.svg"
const formSchema = z.object({
    paymentMethod: z.enum(["cod", "card", "banking", "vnpay"]),
    sameAsShipping: z.boolean().default(true),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
})

export function PaymentForm({ onComplete, onBack }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            paymentMethod: "cod",
            sameAsShipping: true,
            cardNumber: "",
            cardName: "",
            cardExpiry: "",
            cardCvc: "",
        },
    })

    const paymentMethod = form.watch("paymentMethod")
    const sameAsShipping = form.watch("sameAsShipping")

    function onSubmit(values) {
        console.log(values)
        onComplete(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Phương thức thanh toán</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-3"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <RadioGroupItem value="cod" />
                                        </FormControl>
                                        <FormLabel className="font-normal flex items-center">
                                            <Wallet className="mr-2 h-5 w-5" />
                                            Thanh toán khi nhận hàng (COD)
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <RadioGroupItem value="card" />
                                        </FormControl>
                                        <FormLabel className="font-normal flex items-center">
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            Thẻ tín dụng/ghi nợ
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <RadioGroupItem value="vnpay" />
                                        </FormControl>
                                        <FormLabel className="font-normal flex items-center">
                                            <img src={VNPayLogo} alt="VNPay" className="mr-2 h-5 w-5" />
                                            Thanh toán qua VNPay
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <RadioGroupItem value="banking" />
                                        </FormControl>
                                        <FormLabel className="font-normal flex items-center">
                                            <Landmark className="mr-2 h-5 w-5" />
                                            Chuyển khoản ngân hàng
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {paymentMethod === "card" && (
                    <div className="space-y-4 rounded-md border p-4">
                        <h3 className="font-medium">Thông tin thẻ</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="cardNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số thẻ</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1234 5678 9012 3456" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cardName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên chủ thẻ</FormLabel>
                                        <FormControl>
                                            <Input placeholder="NGUYEN VAN A" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="cardExpiry"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ngày hết hạn</FormLabel>
                                            <FormControl>
                                                <Input placeholder="MM/YY" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cardCvc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CVC</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {paymentMethod === "banking" && (
                    <div className="rounded-md border p-4">
                        <h3 className="font-medium mb-2">Thông tin chuyển khoản</h3>
                        <p className="text-sm text-muted-foreground mb-4">Vui lòng chuyển khoản đến tài khoản sau:</p>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="font-medium">Ngân hàng:</span> Vietcombank
                            </p>
                            <p>
                                <span className="font-medium">Số tài khoản:</span> 1234567890
                            </p>
                            <p>
                                <span className="font-medium">Chủ tài khoản:</span> CÔNG TY TNHH SMART HOME
                            </p>
                            <p>
                                <span className="font-medium">Nội dung:</span> [Mã đơn hàng] - [Số điện thoại]
                            </p>
                        </div>
                    </div>
                )}

                <Separator />

                <FormField
                    control={form.control}
                    name="sameAsShipping"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Địa chỉ thanh toán giống với địa chỉ giao hàng</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                {!sameAsShipping && (
                    <div className="space-y-4 rounded-md border p-4">
                        <h3 className="font-medium">Địa chỉ thanh toán</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="Họ tên" />
                            <Input placeholder="Số điện thoại" />
                        </div>
                        <Input placeholder="Địa chỉ" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input placeholder="Tỉnh/Thành phố" />
                            <Input placeholder="Quận/Huyện" />
                            <Input placeholder="Phường/Xã" />
                        </div>
                    </div>
                )}

                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={onBack}>
                        Quay Lại
                    </Button>
                    <Button type="submit">Tiếp tục</Button>
                </div>
            </form>
        </Form>
    )
}