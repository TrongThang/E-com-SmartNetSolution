"use client"
import { Clock } from "lucide-react"

export default function StageStats({ serials }) {
    const total = serials.length
    const inProgress = serials.filter((s) => s.status === "in_progress").length
    const completed = serials.filter((s) => s.status === "completed").length
    const failed = serials.filter((s) => s.status === "fixing" || s.status === "failed").length
    const pendingPackaging = serials.filter((s) => s.status === "pending_packaging").length
    const firmwareUploaded = serials.filter((s) => s.status === "firmware_uploaded").length
    const firmwareUploading = serials.filter((s) => s.status === "firmware_uploading").length
    const firmwareUpload = serials.filter((s) => s.status === "firmware_upload").length
    const fixingLabel = serials.filter((s) => s.status === "fixing_label").length
    const fixingProduct = serials.filter((s) => s.status === "fixing_product").length
    const fixingAll = serials.filter((s) => s.status === "fixing_all").length
    const testing = serials.filter((s) => s.status === "testing").length

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
            {pendingPackaging > 0 && (
                <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span>{pendingPackaging}</span>
                </div>
            )}
            {firmwareUpload > 0 && (
                <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span>{firmwareUpload}</span>
                </div>
            )}
            {firmwareUploading > 0 && (
                <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span>{firmwareUploading}</span>
                </div>
            )}
            {firmwareUploaded > 0 && (
                <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span>{firmwareUploaded}</span>
                </div>
            )}
            {fixingLabel > 0 && (
                <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span>{fixingLabel}</span>
                </div>
            )}
            {fixingProduct > 0 && (
                <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span>{fixingProduct}</span>
                </div>
            )}
            {fixingAll > 0 && (
                <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span>{fixingAll}</span>
                </div>
            )}
            {testing > 0 && (
                <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span>{testing}</span>
                </div>
            )}
        </div>
    )
}
