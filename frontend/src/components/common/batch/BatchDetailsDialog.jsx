import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, User, CheckCircle, Clock, Hash } from "lucide-react"
import { getStatusColor, getStatusLabel, getStatusIcon } from "../planning/planningStatusUtils"

export function BatchDetailsDialog({ isOpen, onClose, batch }) {
  if (!batch) return null

  // Tìm firmware tương ứng dựa trên firmware_id
  const firmware = batch.device_templates?.firmware?.find(
    f => f.firmware_id === batch.firmware_id
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">Chi tiết Lô Sản xuất</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Thông tin chi tiết về lô sản xuất {batch.production_batch_id}
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(batch.status)}>
              {getStatusIcon(batch.status)}
              <span className="ml-1">{getStatusLabel(batch.status)}</span>
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Số lượng sản xuất</p>
                  <p className="text-sm font-bold text-blue-600">{batch.quantity}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                
                <div className="ml-3 w-full">
                  <p className="text-sm font-medium text-green-900">Firmware tên</p>
                  <p className="text-sm font-bold text-green-600 whitespace-normal break-words">
                    {firmware ? `${firmware.name} (v${firmware.version})` : "Không xác định"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                
                <div className="ml-3 w-full">
                  <p className="text-sm font-medium text-yellow-900">Tên Template</p>
                  <p className="text-sm font-bold text-yellow-600 whitespace-normal break-words">
                    {batch.device_templates?.name || batch.template_id}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-900">Ngày tạo</p>
                  <p className="text-sm font-bold text-purple-600">
                    {new Date(batch.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Thông tin chi tiết</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <Label className="text-sm text-gray-500">Người duyệt</Label>
                </div>
                <p className="text-sm font-medium text-gray-900 ml-6">
                  {batch.logs?.approved?.employee_id || "Chưa duyệt"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <Label className="text-sm text-gray-500">Ngày duyệt</Label>
                </div>
                <p className="text-sm font-medium text-gray-900 ml-6">
                  {batch.logs?.approved?.timestamp ? new Date(batch.logs.approved.timestamp).toLocaleDateString("vi-VN") : "Chưa duyệt"}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {batch.batch_note && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Ghi chú</h3>
              <p className="text-sm text-gray-600 bg-white rounded-md p-3 border border-gray-200 whitespace-normal break-words">
                {batch.batch_note}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}