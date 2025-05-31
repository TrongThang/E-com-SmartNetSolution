"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
} from "lucide-react"

export default function FirmwareDetailPage() {
  const [firmware, setFirmware] = useState(null)
  const params = useParams()

  useEffect(() => {
    // Giả lập fetch dữ liệu từ API
    const mockData = {
      firmware_id: 1,
      version: "v2.1.0",
      file_path: "/firmware/camera_v2.1.0.bin",
      template_id: 1,
      template_name: "Camera Xiaomi 360°",
      is_mandatory: true,
      created_at: "2024-01-15T10:30:00Z",
      tested_at: "2024-01-16T14:20:00Z",
      is_approved: true,
      updated_at: "2024-01-16T15:00:00Z",
      is_deleted: false,
      note: "Cập nhật tính năng phát hiện chuyển động và sửa lỗi kết nối WiFi. Phiên bản này cải thiện độ ổn định và thêm các tính năng AI mới.",
      file_size: "2.5 MB",
      download_count: 156,
      created_by: "Admin",
      checksum: "sha256:a1b2c3d4e5f6...",
      device_count: 45,
      success_rate: 98.5,
      changelog: [
        "Thêm tính năng phát hiện chuyển động AI",
        "Sửa lỗi kết nối WiFi không ổn định",
        "Cải thiện hiệu suất xử lý hình ảnh",
        "Tối ưu hóa tiêu thụ pin",
        "Thêm hỗ trợ giao thức mới",
      ],
      test_results: [
        { test_name: "Kiểm tra tính toàn vẹn file", status: "passed", details: "Checksum hợp lệ" },
        { test_name: "Kiểm tra tương thích", status: "passed", details: "Tương thích với tất cả thiết bị" },
        { test_name: "Kiểm tra bảo mật", status: "passed", details: "Không phát hiện lỗ hổng" },
        { test_name: "Kiểm tra hiệu suất", status: "passed", details: "Hiệu suất tốt" },
      ],
    }

    setFirmware(mockData)
  }, [params.id])

  if (!firmware) {
    return <div>Đang tải...</div>
  }

  const getStatusBadge = () => {
    if (!firmware.is_approved && !firmware.tested_at) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Chờ kiểm tra
        </Badge>
      )
    }
    if (firmware.tested_at && !firmware.is_approved) {
      return <Badge variant="destructive">Không được duyệt</Badge>
    }
    if (firmware.is_approved) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Đã duyệt
        </Badge>
      )
    }
    return <Badge variant="secondary">Chưa xác định</Badge>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="gap-1 hover:bg-gray-100">
          <Link to="/admin/manager-template">
            <ArrowLeft className="h-4 w-4" />
            Trở về
          </Link>
        </Button>
      </div>

      {/* Header thông tin */}
      <div className="grid gap-8">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-semibold flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Firmware {firmware.version}
                  {getStatusBadge()}
                </CardTitle>
                <CardDescription className="text-base">
                  {firmware.template_name} • Tạo ngày {formatDate(firmware.created_at)}
                </CardDescription>
              </div>
              <div className="text-right space-y-2">
                {firmware.is_mandatory && (
                  <Badge variant="destructive" className="mb-2 px-3 py-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Bắt buộc
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Nội dung chi tiết */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="grid">
                <div className="flex justify-between items-center p-1 bg-gray-50 rounded-lg">
                  <span className="text-sl font-medium text-gray-600">Phiên bản:</span>
                  <span className="text-sl font-semibold">{firmware.version}</span>
                </div>
                <div className="flex justify-between items-center p-1 bg-gray-50 rounded-lg">
                  <span className="text-sl font-medium text-gray-600">Template:</span>
                  <span className="text-sl font-semibold">{firmware.template_name}</span>
                </div>
                <div className="flex justify-between items-center p-1 bg-gray-50 rounded-lg">
                  <span className="text-sl font-medium text-gray-600">Đường dẫn file:</span>
                  <code className="text-sl bg-gray-100 px-3 py-1.5 rounded-md font-mono">{firmware.file_path}</code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Ghi chú</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">{firmware.note}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
