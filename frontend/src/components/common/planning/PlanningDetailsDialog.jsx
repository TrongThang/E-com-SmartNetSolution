import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  getPlanningStatusColor,
  getPlanningStatusLabel,
  getPlanningStatusIcon,
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
} from "@/components/common/planning/planningStatusUtils"
import { PDFDownloadLink } from '@react-pdf/renderer';
import PlanningPDF from './PlanningPDF';

export function PlanningDetailsDialog({ isOpen, onClose, planning }) {
  if (!planning) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết Kế hoạch Sản xuất {planning.planning_id}</DialogTitle>
          <DialogDescription>Thông tin chi tiết về kế hoạch sản xuất và các đơn sản xuất</DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <PDFDownloadLink
            document={<PlanningPDF planning={planning} />}
            fileName={`planning-${planning?.planning_id}.pdf`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {({ blob, url, loading, error }) =>
              loading ? 'Đang tạo PDF...' : 'Xuất PDF'
            }
          </PDFDownloadLink>
        </div>

        <div className="space-y-6">
          {/* Thông tin kế hoạch */}
          <div className="grid gap-4 py-4 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-600">Mã Kế hoạch</Label>
                <p className="text-sm font-medium mt-1">{planning.planning_id}</p>
              </div>
              <div>
                <Label className="text-gray-600">Trạng thái</Label>
                <div className="mt-1">
                  <Badge className={`${getPlanningStatusColor(planning.status)} px-2 py-1`}>
                    {getPlanningStatusIcon(planning.status)}
                    <span className="ml-1">{getPlanningStatusLabel(planning.status)}</span>
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-gray-600">Ngày tạo</Label>
                <p className="text-sm font-medium mt-1">{new Date(planning.created_at).toLocaleDateString("vi-VN")}</p>
              </div>
              <div>
                <Label className="text-gray-600">Người tạo</Label>
                <p className="text-sm font-medium mt-1">{planning.created_by}</p>
              </div>
              <div>
                <Label className="text-gray-600">Số đơn sản xuất</Label>
                <p className="text-sm font-medium mt-1">{planning.production_batches?.length || 0} đơn sản xuất</p>
              </div>
              <div>
                <Label className="text-gray-600">Cập nhật cuối</Label>
                <p className="text-sm font-medium mt-1">{new Date(planning.updated_at).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>

            <div>
              <Label className="text-gray-600">Ghi chú kế hoạch</Label>
              <p className="text-sm font-medium mt-1 bg-white p-2 rounded whitespace-normal break-words">
                {planning.planning_note || "Không có ghi chú"}
              </p>
            </div>
          </div>

          {/* Danh sách đơn sản xuất */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh sách Đơn Sản xuất</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Đơn Sản xuất</TableHead>
                  <TableHead>Thiết bị</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planning.production_batches && planning.production_batches.length > 0 ? (
                  planning.production_batches.map((batch) => {
                    // Tìm firmware dựa trên firmware_id
                    const firmware = batch.device_templates?.firmware?.find(
                      f => f.firmware_id === batch.firmware_id
                    );

                    return (
                      <TableRow key={batch.production_batch_id}>
                        <TableCell className="font-medium">{batch.production_batch_id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="whitespace-normal break-words">
                              {batch.device_templates?.name || `Template ${batch.template_id}`}
                            </span>
                            {firmware && (
                              <span className="text-xs text-gray-500 whitespace-normal break-words">
                                Firmware: {firmware.name} (v{firmware.version})
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{batch.quantity}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(batch.status)}>
                            {getStatusIcon(batch.status)}
                            <span className="ml-1">{getStatusLabel(batch.status)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(batch.created_at).toLocaleDateString("vi-VN")}</TableCell>
                        <TableCell className="max-w-xs whitespace-normal break-words">
                          {batch.batch_note || "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      Chưa có đơn sản xuất nào trong kế hoạch này
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}