import { CheckCircle2 } from "lucide-react"

export function CheckoutSteps({ currentStep }) {
    const steps = [
        { id: "shipping", label: "THÔNG TIN GIAO HÀNG" },
        { id: "payment", label: "THANH TOÁN" },
        { id: "review", label: "XÁC NHẬN" },
    ]

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center">
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                currentStep === step.id
                                    ? "border-[#22c55e] bg-[#22c55e] text-white"  // Màu xanh lá cho bước hiện tại
                                    : currentStep === steps[index + 1]?.id || currentStep === steps[index + 2]?.id
                                        ? "border-[#3b82f6] bg-[#3b82f6] text-white"  // Màu xanh nước biển cho các bước tiếp theo
                                        : "border-gray-300 text-gray-400"  // Màu xám nhạt cho các bước còn lại
                            }`}
                        >
                            {currentStep === step.id ||
                                currentStep === steps[index + 1]?.id ||
                                currentStep === steps[index + 2]?.id ? (
                                <CheckCircle2 className="h-5 w-5" />
                            ) : (
                                <span>{index + 1}</span>
                            )}
                        </div>
                        <span
                            className={`mt-2 text-sm ${currentStep === step.id
                                    ? "font-medium"
                                    : currentStep === steps[index + 1]?.id || currentStep === steps[index + 2]?.id
                                        ? "font-medium"
                                        : "text-muted-foreground"
                                }`}
                        >
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="relative mt-2">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted-foreground/20">
                    <div
                        className="h-full bg-primary transition-all"
                        style={{
                            width: currentStep === "shipping" ? "0%" : currentStep === "payment" ? "50%" : "100%",
                        }}
                    />
                </div>
            </div>
        </div>
    )
}