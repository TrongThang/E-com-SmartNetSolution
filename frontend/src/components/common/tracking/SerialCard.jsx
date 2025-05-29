"use client"
import { useState } from "react"
import { Eye, Clock, Tags, FileUp, SearchCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import StageLogHistory from "./StageLogHistory"

export default function SerialCard({ serialData, isCheckable = true, isSelected = false, onSelect }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const isPendingApproval = serialData.status === "pending_approval"
    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hoàn thành</Badge>
            case "in_progress":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đang xử lý</Badge>
            case "pending_approval":
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Chờ duyệt</Badge>
            case "failed":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Thất bại</Badge>
            case "fixing":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Cần sửa</Badge>
            case "firmware_upload":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <FileUp className="w-4 h-4" />
                    Nạp firmware
                </Badge>
            case "scanned":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <SearchCheck className="w-4 h-4" />
                    Đã quét
                </Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Chờ xử lý</Badge>
        }
    }

    return (
        <div
            className={`border rounded-lg p-4 transition-colors ${isPendingApproval ? "bg-orange-50 border-orange-200" : "bg-white hover:bg-gray-50"
                }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {isCheckable && !isPendingApproval && (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onSelect?.(serialData.serial)}
                            className="rounded border-gray-300"
                        />
                    )}
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">{serialData.serial}</span>
                            {getStatusBadge(serialData.status)}
                            {isPendingApproval && <Clock className="w-4 h-4 text-orange-500" />}
                        </div>
                        <p className="text-sm text-gray-600">Chi phí: {serialData.cost?.toLocaleString("vi-VN")} VNĐ</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {serialData.stage_logs && serialData.stage_logs.length >= 0 && (
                        <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                            <Eye className="w-4 h-4 mr-1" />
                            Lịch sử ({serialData.stage_logs.length})
                        </Button>
                    )}
                </div>
            </div>

            <Collapsible open={isExpanded}>
                <CollapsibleContent className="mt-4">
                    <StageLogHistory logs={serialData.stage_logs} />
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}
