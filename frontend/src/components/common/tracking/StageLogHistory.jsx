"use client"
import { CheckCircle, Clock, XCircle, AlertTriangle, Tags, FileUp } from "lucide-react"

export default function StageLogHistory({ logs }) {

    const getLogStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case "in_progress":
                return <Clock className="w-4 h-4 text-blue-500" />
            case "failed":
                return <XCircle className="w-4 h-4 text-red-500" />
            case "labelling":
                return <Tags className="w-4 h-4 text-amber-950" />
            case "firmware_upload":
                return <FileUp className="w-4 h-4 text-yellow-500" />
            default:
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />
        }
    }

    const formatDateTime = (dateString) => {
        if (!dateString) return "Chưa hoàn thành"
        return new Date(dateString).toLocaleString("vi-VN")
    }

    const renderStageLog = (log, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            {getLogStatusIcon(log.status)}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900"> <span>Giai đoạn: </span> 
                        {
                            log.stage === "assembly" ? "Lắp ráp" :
                            log.stage === "qc" ? "Kiểm thử" :
                            log.stage === "completed" ? "Hoàn thành" :
                            log.stage
                        }
                    </h4>
                    <span className="text-xs text-gray-500">NV: {log.employee_id}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{log.note}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>Bắt đầu: {formatDateTime(log.started_at)}</span>
                    <span>Kết thúc: {formatDateTime(log.completed_at)}</span>
                </div>
                {log.approved_by && <p className="text-xs text-gray-500 mt-1">Duyệt bởi: {log.approved_by}</p>}
                <p className="text-xs text-gray-500 mt-1">
                    Ghi chú: {log?.note}
                </p>
            </div>
        </div>
    )

    if (!logs || logs.length === 0) {
        return (
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Lịch sử giai đoạn:</h4>
                <p className="text-sm text-gray-500">Chưa có lịch sử giai đoạn</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Lịch sử giai đoạn:</h4>
            <div className="space-y-2">{logs.map((log, index) => renderStageLog(log, index))}</div>
        </div>
    )
}
