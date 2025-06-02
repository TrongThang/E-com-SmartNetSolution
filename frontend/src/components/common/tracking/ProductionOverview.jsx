"use client"
import { Package, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductionOverview({ serialsByStage }) {
    const getTotalStats = () => {
        const total = Object.values(serialsByStage).flat().length
        const pending = serialsByStage.pending?.length || 0
        const inProgress = (serialsByStage.assembly?.length || 0) + (serialsByStage.qc?.length || 0)
        const completed = serialsByStage.completed?.length || 0
        const failed = Object.values(serialsByStage)
            .flat()
            .filter((s) => s.status === "failed").length

        return { total, pending, inProgress, completed, failed }
    }

    const stats = getTotalStats()

    const statCards = [
        {
            title: "Tổng sản phẩm",
            value: stats.total,
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Chờ duyệt",
            value: stats.pending,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Đang sản xuất",
            value: stats.inProgress,
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Hoàn thành",
            value: stats.completed,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Lỗi",
            value: stats.failed,
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {statCards.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
