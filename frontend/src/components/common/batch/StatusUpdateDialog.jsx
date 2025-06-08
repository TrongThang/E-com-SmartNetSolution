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
import {
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
  getNextStatusOptions,
} from "@/components/common/planning/statusUtils"

const statusUpdateSchema = z.object({
  status: z.enum(["pendingimport", "completed", "relabeling", "fixproduction"]),
  notes: z.string().optional(),
})

export function StatusUpdateDialog({ isOpen, onClose, onSubmit, batch, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      status: "pendingimport",
      notes: "",
    },
  })

  const handleSubmit = async (data) => {
    await onSubmit(data)
    form.reset()
  }

  if (!batch) return null

  const nextOptions = getNextStatusOptions(batch.status)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cập nhật Trạng thái Đơn sản xuất {batch.production_batch_id}</DialogTitle>
          <DialogDescription>Chuyển đổi trạng thái đơn sản xuất theo quy trình</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-xs text-gray-500">Trạng thái hiện tại:</Label>
              <Badge className={getStatusColor(batch.status)}>
                {getStatusIcon(batch.status)}
                <span className="ml-1">{getStatusLabel(batch.status)}</span>
              </Badge>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái mới *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái mới" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nextOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(option.value)}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
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
                    <FormLabel>Ghi chú (Tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập ghi chú về việc cập nhật trạng thái..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Ghi chú về lý do thay đổi trạng thái</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
