import { CheckCircle, XCircle, Clock, AlertTriangle, Play, Warehouse, Tag, Wrench } from "lucide-react"

// Cập nhật các hàm xử lý trạng thái để bao gồm tất cả cases
export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "in_progress":
      return "bg-blue-100 text-blue-800"
    case "pendingimport":
      return "bg-purple-100 text-purple-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "relabeling":
      return "bg-orange-100 text-orange-800"
    case "fixproduction":
      return "bg-pink-100 text-pink-800"
    case "expired":
      return "bg-red-100 text-red-800"
    case "cancelled":
      return "bg-slate-100 text-slate-800"

    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getStatusLabel = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Chờ duyệt"
    case "rejected":
      return "Không được duyệt"
    case "in_progress":
      return "Đang sản xuất"
    case "pendingimport":
      return "Chờ nhập kho"
    case "completed":
      return "Hoàn thành"
    case "relabeling":
      return "Dán lại nhãn"
    case "fixproduction":
      return "Chỉnh sửa sản phẩm"
    case "expired":
      return "Hết hạn"
    case "cancelled":
      return "Đã hủy"

    default:
      return status
  }
}

export const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle className="w-4 h-4" />
    case "in_progress":
      return <Play className="w-4 h-4" />
    case "pendingimport":
      return <Warehouse className="w-4 h-4" />
    case "pending":
      return <Clock className="w-4 h-4" />
    case "rejected":
      return <XCircle className="w-4 h-4" />
    case "relabeling":
      return <Tag className="w-4 h-4" />
    case "fixproduction":
      return <Wrench className="w-4 h-4" />
    case "expired":
      return <AlertTriangle className="w-4 h-4" />
    case "cancelled":
      return <XCircle className="w-4 h-4" />

    default:
      return <AlertTriangle className="w-4 h-4" />
  }
}

// Cập nhật getNextStatusOptions để bao gồm các trạng thái mới
export const getNextStatusOptions = (currentStatus) => {
  switch (currentStatus) {
    case "in_progress":
      return [{ value: "pendingimport", label: "Chờ nhập kho" }]
    case "pendingimport":
      return [
        { value: "completed", label: "Hoàn thành" },
        { value: "relabeling", label: "Dán lại nhãn" },
        { value: "fixproduction", label: "Chỉnh sửa sản phẩm" },
      ]
    case "relabeling":
      return [{ value: "pendingimport", label: "Chờ nhập kho" }]
    case "fixproduction":
      return [{ value: "pendingimport", label: "Chờ nhập kho" }]

    case "completed":
      return [] // Không thể chuyển từ completed
    case "rejected":
      return [] // Không thể chuyển từ rejected
    case "cancelled":
      return [] // Không thể chuyển từ cancelled
    case "expired":
      return [] // Không thể chuyển từ expired
    default:
      return []
  }
}
