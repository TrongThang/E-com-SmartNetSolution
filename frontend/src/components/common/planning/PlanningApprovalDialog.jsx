"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle } from "lucide-react"
import {
  getPlanningStatusColor,
  getPlanningStatusLabel,
  getPlanningStatusIcon,
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
} from "@/components/common/planning/planningStatusUtils"

const planningApprovalSchema = z.object({
  action: z.enum(["approve", "reject"]),
  notes: z.string().min(1, "Ghi chú phê duyệt là bắt buộc").max(500, "Ghi chú không được quá 500 ký tự"),
})

export function PlanningApprovalDialog({ isOpen, onClose, onSubmit, planning, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(planningApprovalSchema),
    defaultValues: {
      action: "approve",
      notes: "",
    },
  })

  const handleSubmit = async (data) => {
    await onSubmit(data)
    form.reset()
  }

  if (!planning) return null

  const totalBatches = planning.batches?.length || 0
  const totalQuantity = planning.batches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Phê duyệt Kế hoạch Sản xuất {planning.planning_id}</DialogTitle>
          <DialogDescription>Xem xét và quyết định phê duyệt hoặc từ chối kế hoạch sản xuất này</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin tổng quan kế hoạch */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-xs text-gray-500">Mã kế hoạch</Label>
              <p className="font-medium">{planning.planning_id}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Trạng thái hiện tại</Label>
              <div className="mt-1">
                <Badge className={getPlanningStatusColor(planning.status)}>
                  {getPlanningStatusIcon(planning.status)}
                  <span className="ml-1">{getPlanningStatusLabel(planning.status)}</span>
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Số lô</Label>
              <p className="font-medium">{totalBatches} lô</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Tổng số lượng</Label>
              <p className="font-medium">{totalQuantity} sản phẩm</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Người tạo</Label>
              <p className="font-medium">{planning.created_by}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Ngày tạo</Label>
              <p className="font-medium">{new Date(planning.created_at).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>

          {/* Ghi chú kế hoạch */}
          {planning.planning_note && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <Label className="text-xs text-blue-600">Ghi chú kế hoạch</Label>
              <p className="text-sm text-blue-800 mt-1">{planning.planning_note}</p>
            </div>
          )}

          {/* Danh sách lô trong kế hoạch */}
          <div>
            <h4 className="font-medium mb-3">Danh sách lô trong kế hoạch</h4>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Lô</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ghi chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planning.batches?.map((batch) => (
                    <TableRow key={batch.batch_id}>
                      <TableCell className="font-medium">{batch.production_batch_id}</TableCell>
                      <TableCell>{batch.template_name || batch.template_id}</TableCell>
                      <TableCell>{batch.quantity}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(batch.status)}>
                          {getStatusIcon(batch.status)}
                          <span className="ml-1">{getStatusLabel(batch.status)}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{batch.batch_note || "-"}</TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        Chưa có lô nào trong kế hoạch này
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Form phê duyệt */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quyết định *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quyết định" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="approve">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Phê duyệt kế hoạch và bắt đầu sản xuất
                          </div>
                        </SelectItem>
                        <SelectItem value="reject">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            Từ chối kế hoạch
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú phê duyệt *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập lý do phê duyệt hoặc từ chối kế hoạch..."
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Ghi chú này sẽ được lưu lại và hiển thị cho người tạo kế hoạch</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
