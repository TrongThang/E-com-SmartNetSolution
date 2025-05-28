"use client"

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

export function PlanningDetailsDialog({ isOpen, onClose, planning }) {
  if (!planning) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết Kế hoạch Sản xuất {planning.planning_id}</DialogTitle>
          <DialogDescription>Thông tin chi tiết về kế hoạch sản xuất và các lô</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin kế hoạch */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Mã Kế hoạch</Label>
                <p className="text-sm font-medium">{planning.planning_id}</p>
              </div>
              <div>
                <Label>Trạng thái</Label>
                <div className="mt-1">
                  <Badge className={getPlanningStatusColor(planning.status)}>
                    {getPlanningStatusIcon(planning.status)}
                    <span className="ml-1">{getPlanningStatusLabel(planning.status)}</span>
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Ngày tạo</Label>
                <p className="text-sm font-medium">{new Date(planning.created_at).toLocaleDateString("vi-VN")}</p>
              </div>
              <div>
                <Label>Người tạo</Label>
                <p className="text-sm font-medium">{planning.created_by}</p>
              </div>
              <div>
                <Label>Số lô</Label>
                <p className="text-sm font-medium">{planning.batches?.length || 0} lô</p>
              </div>
              <div>
                <Label>Cập nhật cuối</Label>
                <p className="text-sm font-medium">{new Date(planning.updated_at).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>

            <div>
              <Label>Ghi chú kế hoạch</Label>
              <p className="text-sm font-medium">{planning.planning_note || "Không có ghi chú"}</p>
            </div>
          </div>

          {/* Danh sách lô */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh sách Lô Sản xuất</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Lô</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planning.batches?.map((batch) => (
                  <TableRow key={batch.batch_id}>
                    <TableCell className="font-medium">{batch.production_batch_id}</TableCell>
                    <TableCell>{batch.template_id}</TableCell>
                    <TableCell>{batch.quantity}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(batch.status)}>
                        {getStatusIcon(batch.status)}
                        <span className="ml-1">{getStatusLabel(batch.status)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(batch.created_at).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell className="max-w-xs truncate">{batch.batch_note || "-"}</TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      Chưa có lô nào trong kế hoạch này
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
