"use client"
import { useState } from "react"
import { Eye, Clock, AlertCircle, CheckCircle, Package, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export default function SerialCard({ serialData, isCheckable = true, isSelected = false, onSelect }) {
    const [isExpanded, setIsExpanded] = useState(false)

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                label: "Chờ duyệt",
                color: "bg-orange-100 text-orange-800 border-orange-200",
                icon: Clock,
                dotColor: "bg-orange-500",
            },
            completed: {
                label: "Hoàn thành",
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
                dotColor: "bg-green-500",
            },
            in_progress: {
                label: "Đang xử lý",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: Package,
                dotColor: "bg-blue-500",
            },
            failed: {
                label: "Thất bại",
                color: "bg-red-100 text-red-800 border-red-200",
                icon: AlertCircle,
                dotColor: "bg-red-500",
            },
            firmware_upload: {
                label: "Chờ firmware",
                color: "bg-purple-100 text-purple-800 border-purple-200",
                icon: Clock,
                dotColor: "bg-purple-500",
            },
            firmware_uploading: {
                label: "Đang nạp firmware",
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: Package,
                dotColor: "bg-yellow-500",
            },
            firmware_uploaded: {
                label: "Firmware đã nạp",
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
                dotColor: "bg-green-500",
            },
            testing: {
                label: "Đang kiểm thử",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: Package,
                dotColor: "bg-blue-500",
            },
            fixing_label: {
                label: "Chờ sửa nhãn",
                color: "bg-orange-100 text-orange-800 border-orange-200",
                icon: AlertCircle,
                dotColor: "bg-orange-500",
            },
            fixing_product: {
                label: "Chờ sửa sản phẩm",
                color: "bg-orange-100 text-orange-800 border-orange-200",
                icon: AlertCircle,
                dotColor: "bg-orange-500",
            },
            fixing_all: {
                label: "Chờ sửa tất cả",
                color: "bg-red-100 text-red-800 border-red-200",
                icon: AlertCircle,
                dotColor: "bg-red-500",
            },
        }

        return (
            configs[status] || {
                label: "Chờ xử lý",
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: Clock,
                dotColor: "bg-gray-500",
            }
        )
    }

    const statusConfig = getStatusConfig(serialData.status)
    const StatusIcon = statusConfig.icon

    const handleHistoryClick = (e) => {
        e.stopPropagation()
        setIsExpanded(!isExpanded)
    }

    return (
        <Card
            className={cn(
                "transition-all duration-200 hover:shadow-md",
                isSelected && "ring-2 ring-blue-500 ring-offset-2",
                serialData.status === "failed" && "bg-red-50 border-red-200",
            )}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isCheckable && serialData.status !== "failed" && (
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => onSelect?.(serialData.serial)}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                        )}

                        <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", statusConfig.dotColor)}></div>
                            <span className="font-mono font-semibold text-gray-900">{serialData.serial}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge className={cn("border", statusConfig.color)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                        </Badge>

                        {serialData.stage_logs && serialData.stage_logs.length > 0 && (
                            <Button variant="outline" size="sm" onClick={handleHistoryClick} className="h-8 px-2">
                                <Eye className="w-3 h-3 mr-1" />
                                Lịch sử ({serialData.stage_logs.length})
                                {isExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                            </Button>
                        )}
                    </div>
                </div>

                <Collapsible open={isExpanded}>
                    <CollapsibleContent className="mt-4">
                        <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Lịch sử giai đoạn</h4>
                            {serialData.stage_logs && serialData.stage_logs.length > 0 ? (
                                <div className="space-y-3">
                                    {serialData.stage_logs.map((log, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {log.stage === "assembly"
                                                        ? "Lắp ráp"
                                                        : log.stage === "qc"
                                                            ? "Kiểm thử"
                                                            : log.stage === "completed"
                                                                ? "Hoàn thành"
                                                                : log.stage}
                                                </span>
                                                <span className="text-xs text-gray-500">NV: {log.employee_id}</span>
                                            </div>
                                            {log.note && <p className="text-sm text-gray-600 mb-2">{log.note}</p>}
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>
                                                    Bắt đầu: {log.started_at ? new Date(log.started_at).toLocaleString("vi-VN") : "N/A"}
                                                </span>
                                                <span>
                                                    Kết thúc:{" "}
                                                    {log.completed_at ? new Date(log.completed_at).toLocaleString("vi-VN") : "Chưa hoàn thành"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Chưa có lịch sử giai đoạn</p>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    )
}
