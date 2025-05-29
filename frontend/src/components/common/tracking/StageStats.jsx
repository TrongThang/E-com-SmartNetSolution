"use client"
import { Clock } from "lucide-react"

export default function StageStats({ serials }) {
    const total = serials.length
    const inProgress = serials.filter((s) => s.status === "in_progress").length
    const completed = serials.filter((s) => s.status === "completed").length
    const pendingApproval = serials.filter((s) => s.status === "pending_approval").length
    const failed = serials.filter((s) => s.status === "fixing" || s.status === "failed").length

    return (
        <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
                <span className="text-gray-500">Tổng:</span>
                <span className="font-medium">{total}</span>
            </div>
            {inProgress > 0 && (
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{inProgress}</span>
                </div>
            )}
            {pendingApproval > 0 && (
                <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span>{pendingApproval}</span>
                </div>
            )}
            {failed > 0 && (
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>{failed}</span>
                </div>
            )}
            {completed > 0 && (
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{completed}</span>
                </div>
            )}
        </div>
    )
}
