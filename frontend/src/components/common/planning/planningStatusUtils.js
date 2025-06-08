import { CheckCircle, XCircle, Clock, AlertTriangle, Play, Warehouse, Tag, Wrench, Calendar } from "lucide-react"

// Utility functions cho Planning Status
export const calculatePlanningStatus = (batches) => {
  if (!batches || batches.length === 0) return "pending"

  // Lọc ra các lô không bị hủy
  const activeBatches = batches.filter((batch) => batch.status !== "rejected" && batch.status !== "cancelled")

  // Nếu tất cả lô đều bị hủy
  if (activeBatches.length === 0) {
    return "rejected"
  }

  // Kiểm tra có lô nào cần fix không
  const hasFixBatches = activeBatches.some((batch) => batch.status === "relabeling" || batch.status === "fixproduction")

  if (hasFixBatches) {
    return "fix"
  }

  // Tìm trạng thái chậm nhất (theo thứ tự: pending → in_progress → pendingimport → completed)
  const statusPriority = {
    pending: 1,
    in_progress: 2,
    pendingimport: 3,
    completed: 4,
    expired: 0,
    cancelled: 0,
  }

  const slowestBatch = activeBatches.reduce((slowest, current) => {
    const currentPriority = statusPriority[current.status] || 0
    const slowestPriority = statusPriority[slowest.status] || 0
    return currentPriority < slowestPriority ? current : slowest
  })

  return slowestBatch.status
}

export const getPlanningStatusColor = (status) => {
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
    case "fix":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getPlanningStatusLabel = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Chờ duyệt"
    case "rejected":
      return "Đã hủy"
    case "in_progress":
      return "Đang sản xuất"
    case "pendingimport":
      return "Chờ nhập kho"
    case "completed":
      return "Hoàn thành"
    case "fix":
      return "Cần xử lý"
    default:
      return status
  }
}

export const getPlanningStatusIcon = (status) => {
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
    case "fix":
      return <Wrench className="w-4 h-4" />
    default:
      return <Calendar className="w-4 h-4" />
  }
}

// Batch status utilities (bỏ paused)
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
      return "bg-gray-100 text-gray-800"
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
    case "pending":
      return [{ value: "cancelled", label: "Hủy đơn sản xuất" }]
    case "completed":
      return []
    case "rejected":
      return []
    case "cancelled":
      return []
    case "expired":
      return []
    default:
      return []
  }
}
