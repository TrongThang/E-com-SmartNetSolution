"use client"
import { Check, Clock, AlertCircle, ChevronDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function StateTimeline({ stages, serialsByStage, onStageSelect, selectedStage }) {
    const getStageProgress = (stageId) => {
        const stageSerials = serialsByStage[stageId] || []
        if (stageSerials.length === 0) return { progress: 0, status: "empty" }

        const completed = stageSerials.filter((s) => s.status === "completed").length
        const failed = stageSerials.filter((s) => s.status === "failed").length
        const inProgress = stageSerials.length - completed - failed

        const progress = (completed / stageSerials.length) * 100

        let status = "pending"
        if (failed > 0) status = "warning"
        else if (inProgress > 0) status = "active"
        else if (completed === stageSerials.length && stageSerials.length > 0) status = "completed"

        return { progress, status, completed, failed, inProgress, total: stageSerials.length }
    }
    
    const getStageIcon = (status) => {
        switch (status) {
            case "completed":
                return <Check className="w-5 h-5 text-white" />
            case "active":
                return <Clock className="w-5 h-5 text-white" />
            case "warning":
                return <AlertCircle className="w-5 h-5 text-white" />
            default:
                return <div className="w-2 h-2 bg-white rounded-full" />
        }
    }

    const getStageColors = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-500 border-green-500"
            case "active":
                return "bg-blue-500 border-blue-500"
            case "warning":
                return "bg-red-500 border-red-500"
            default:
                return "bg-gray-300 border-gray-300"
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Timeline Sản Xuất
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {stages.map((stage, index) => {
                        const stageData = getStageProgress(stage.id)
                        const isSelected = selectedStage === stage.id
                        const isLast = index === stages.length - 1

                        return (
                            <div key={stage.id} className="relative">
                                <div
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                                        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300",
                                    )}
                                    onClick={() => onStageSelect(stage.id)}
                                >
                                    {/* Stage Icon */}
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                            getStageColors(stageData.status),
                                        )}
                                    >
                                        {getStageIcon(stageData.status)}
                                    </div>

                                    {/* Stage Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {stageData.total} sản phẩm
                                                </Badge>
                                                {isSelected ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3">{stage.description}</p>

                                        {/* Progress Bar */}
                                        {stageData.total > 0 && (
                                            <div className="space-y-2">
                                                <Progress value={stageData.progress} className="h-2" />
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Hoàn thành: {stageData.completed}</span>
                                                    <span>Đang xử lý: {stageData.inProgress}</span>
                                                    {stageData.failed > 0 && <span className="text-red-500">Lỗi: {stageData.failed}</span>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Connector Line */}
                                {!isLast && <div className="absolute left-9 top-20 w-0.5 h-4 bg-gray-300"></div>}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
