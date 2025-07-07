"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

const createPlanningSchema = z.object({
  planning_note: z.string().min(1, "Ghi chú kế hoạch không được để trống"),
})

export function CreatePlanningDialog({ isOpen, onClose, onSubmit, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(createPlanningSchema),
    defaultValues: {
      planning_note: "",
    },
  })

  const handleSubmit = async (data) => {
    await onSubmit(data)
    form.reset()
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo Kế hoạch Sản xuất Mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo kế hoạch sản xuất mới. Bạn sẽ thêm các đơn sản xuất trong bước tiếp theo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="planning_note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú kế hoạch *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập ghi chú về kế hoạch sản xuất..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Thông tin bổ sung về kế hoạch sản xuất (bắt buộc)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tiếp theo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
