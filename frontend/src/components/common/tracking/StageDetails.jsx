"use client"
import { useState } from "react"
import { Search, Filter, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SerialCard from "./SerialCard"
import Swal from "sweetalert2"
import { exportMultipleQRCodesToPDF } from "@/utils/print"
import axiosIOTPublic from "@/apis/clients/iot.public.client"

export default function StageDetails({
    stage,
    serials,
    selectedSerials,
    setSelectedSerials,
    onSelectSerial,
    onSelectAllSerial,
    onReject,
    onApprove,
    loading = false,
}) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [note, setNote] = useState("")

    const filteredSerials = serials.filter((serial) => {
        const matchesSearch = serial.serial.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || serial.status === statusFilter
        return matchesSearch && matchesStatus
    })
    

    const isAllSelected =
        filteredSerials.length > 0 && filteredSerials.every((serial) => selectedSerials.includes(serial.serial))

    const getStageActions = () => {
        switch (stage.id) {
            case "pending":
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={loading || selectedSerials.length === 0}
                            className="flex-1"
                        >
                            Từ chối ({selectedSerials.length})
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={loading || selectedSerials.length === 0}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                            Duyệt sản xuất ({selectedSerials.length})
                        </Button>
                    </div>
                )
            case "assembly":
                return (
                    <Button
                        variant="outline"
                        onClick={handlePrintSerial}
                        disabled={loading || selectedSerials.length === 0}
                        className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        In mã Serial ({selectedSerials.length})
                    </Button>
                )
            case "qc":
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            onClick={onReject}
                            disabled={loading || selectedSerials.length === 0}
                            className="w-full bg-red-600 hover:bg-red-700"
                        >
                            Từ chối ({selectedSerials.length})
                            </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 w-full"
                            onClick={onApprove}
                            disabled={loading || selectedSerials.length === 0}
                        >
                            Duyệt ({selectedSerials.length})
                        </Button>
                    </div>
                )
            default:
                return null
        }
    }

    const getUniqueStatuses = () => {
        const statuses = [...new Set(serials.map((s) => s.status))]
        return statuses.map((status) => ({
            value: status,
            label:
                status === "pending"
                    ? "Chờ duyệt"
                    : status === "completed"
                        ? "Hoàn thành"
                        : status === "in_progress"
                            ? "Đang xử lý"
                            : status === "failed"
                                ? "Thất bại"
                                : status,
        }))
    }

    if (serials.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-2">Không có serial nào trong giai đoạn này</div>
                    <p className="text-sm text-gray-500">Serial sẽ xuất hiện ở đây khi được chuyển từ giai đoạn trước</p>
                </CardContent>
            </Card>
        )
    }

    const handleNext = async () => {
        if (selectedSerials.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Chưa chọn serial",
                text: "Vui lòng chọn ít nhất một serial để tiếp tục",
            })
            return
        }
        
        const response = await axiosIOTPublic.post(`production-tracking/approve-production-serial`, {
            device_serials: selectedSerials,
            note: note,
        })

        if (response.success) {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: response.message,
            })
            setSelectedSerials([])
        } else {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: response.message,
            })
        }
    }

    const handleCancel = async () => {
        if (selectedSerials.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Chưa chọn serial",
                text: "Vui lòng chọn ít nhất một serial để tiếp tục",
            })
            return
        }
        
        const response = await axiosIOTPublic.patch(`production-tracking/cancel-production-serial`, {
            device_serials: selectedSerials,
            note: note,
        })

        if (response.success) {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: response.message,
            })
            setNote("")
            setSelectedSerials([])
        } else {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: response.message,
            })
        }
    }

    const handlePrintSerial = () => {
        if (selectedSerials.length === 0) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Vui lòng chọn sản phẩm để in mã Serial',
                icon: 'warning',
            });
            return;
        }
        console.log("selectedSerials", selectedSerials);
        exportMultipleQRCodesToPDF(selectedSerials);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{stage.label}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                        {serials.length} sản phẩm
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Search and Filter */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm serial..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            {getUniqueStatuses().map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Select All */}
                {stage.id !== "completed" && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={onSelectAllSerial}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Chọn tất cả ({selectedSerials.length}/{filteredSerials.length})
                        </label>
                    </div>
                )}

                {/* Serial Cards */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredSerials.map((serialData) => (
                        <SerialCard
                            key={serialData.serial}
                            serialData={serialData}
                            isCheckable={stage.id !== "completed"}
                            isSelected={selectedSerials.includes(serialData.serial)}
                            onSelect={onSelectSerial}
                        />
                    ))}
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú cho giai đoạn này</label>
                    <Textarea
                        placeholder="Nhập ghi chú..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className="resize-none"
                    />
                </div>

                {/* Actions */}
                {getStageActions()}
            </CardContent>
        </Card>
    )
}
