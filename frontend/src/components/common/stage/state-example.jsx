"use client"
import { useState } from "react"
import StageIndicator from "./state-indicator"
import { FileText, CreditCard, Truck, CheckCircle, User, Settings } from "lucide-react"

const StageExamples = () => {
    const [currentOrderStage, setCurrentOrderStage] = useState(1)
    const [currentProjectStage, setCurrentProjectStage] = useState(2)

    // Order process stages
    const orderStages = [
        { label: "Đặt hàng", description: "Đơn hàng đã được tạo", icon: <FileText className="w-4 h-4" /> },
        { label: "Thanh toán", description: "Xử lý thanh toán", icon: <CreditCard className="w-4 h-4" /> },
        { label: "Vận chuyển", description: "Đang giao hàng", icon: <Truck className="w-4 h-4" /> },
        { label: "Hoàn thành", description: "Đã giao thành công", icon: <CheckCircle className="w-4 h-4" /> },
    ]

    // Project development stages
    const projectStages = [
        { label: "Khởi tạo", description: "Lập kế hoạch dự án" },
        { label: "Phát triển", description: "Coding và testing" },
        { label: "Kiểm thử", description: "QA và bug fixing" },
        { label: "Triển khai", description: "Deploy lên production" },
        { label: "Bảo trì", description: "Maintenance và support" },
    ]

    // User onboarding stages
    const onboardingStages = [
        { label: "Đăng ký", icon: <User className="w-4 h-4" /> },
        { label: "Xác thực", icon: <FileText className="w-4 h-4" /> },
        { label: "Thiết lập", icon: <Settings className="w-4 h-4" /> },
        { label: "Hoàn thành", icon: <CheckCircle className="w-4 h-4" /> },
    ]

    // Timeline stages with dates
    const timelineStages = [
        {
            label: "Dự án bắt đầu",
            description: "Khởi động dự án và phân công nhiệm vụ",
            date: "15/01/2024",
        },
        {
            label: "Phân tích yêu cầu",
            description: "Thu thập và phân tích requirements",
            date: "22/01/2024",
        },
        {
            label: "Thiết kế hệ thống",
            description: "Thiết kế kiến trúc và database",
            date: "05/02/2024",
        },
        {
            label: "Phát triển",
            description: "Coding các tính năng chính",
            date: "Đang thực hiện",
        },
        {
            label: "Testing",
            description: "Kiểm thử và sửa lỗi",
            date: "Dự kiến 01/03/2024",
        },
    ]

    return (
        <div className="space-y-12 p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Stage Indicator Examples</h1>

            {/* Horizontal Order Process */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Quy trình đặt hàng (Horizontal)</h2>
                <StageIndicator
                    stages={orderStages}
                    currentStage={currentOrderStage}
                    variant="horizontal"
                    size="md"
                    showLabels={true}
                    showDescription={true}
                />
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentOrderStage(Math.max(0, currentOrderStage - 1))}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={() => setCurrentOrderStage(Math.min(orderStages.length - 1, currentOrderStage + 1))}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>

            {/* Vertical Project Stages */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Giai đoạn dự án (Vertical)</h2>
                <div className="flex justify-center">
                    <StageIndicator
                        stages={projectStages}
                        currentStage={currentProjectStage}
                        variant="vertical"
                        size="lg"
                        showLabels={true}
                        clickable={true}
                        onStageClick={(index) => setCurrentProjectStage(index)}
                    />
                </div>
            </div>

            {/* Simple Onboarding */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Quy trình onboarding (Simple)</h2>
                <p>Mỗi trạng thái là một section riêng</p>
                <StageIndicator stages={onboardingStages} currentStage={2} variant="horizontal" size="sm" showLabels={true} />
            </div>

            {/* Timeline View */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Timeline dự án</h2>
                <StageIndicator
                    stages={timelineStages}
                    currentStage={3}
                    variant="timeline"
                    size="md"
                    showLabels={true}
                    showDescription={true}
                />
            </div>

            {/* Progress Bar Style */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Progress Bar với các mốc</h2>
                <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${((currentOrderStage + 1) / orderStages.length) * 100}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                        {orderStages.map((stage, index) => (
                            <div key={index} className="text-xs text-center">
                                <div
                                    className={`w-4 h-4 rounded-full mx-auto mb-1 ${index <= currentOrderStage ? "bg-blue-500" : "bg-gray-300"
                                        }`}
                                ></div>
                                <span className={index <= currentOrderStage ? "text-blue-600" : "text-gray-500"}>{stage.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Compact Status */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Trạng thái compact</h2>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Tiến độ:</span>
                    <StageIndicator
                        stages={[
                            { label: "Bắt đầu" },
                            { label: "Đang xử lý" },
                            { label: "Gần hoàn thành" },
                            { label: "Hoàn thành" },
                        ]}
                        currentStage={1}
                        variant="horizontal"
                        size="sm"
                        showLabels={false}
                    />
                    <span className="text-sm font-medium text-blue-600">Đang xử lý (2/4)</span>
                </div>
            </div>
        </div>
    )
}

export default StageExamples
