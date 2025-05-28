"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus } from "lucide-react"

const createPlanningSchema = z.object({
  planning_note: z.string().optional(),
  batch_count: z.number().min(1, "Số lô phải lớn hơn 0").max(20, "Không được tạo quá 20 lô"),
})

export function CreatePlanningDialog({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [batchCount, setBatchCount] = useState(1)

  const form = useForm({
    resolver: zodResolver(createPlanningSchema),
    defaultValues: {
      planning_note: "",
      batch_count: 1,
    },
  })

  const handleSubmit = async (data) => {
    await onSubmit({ ...data, batch_count: batchCount })
    form.reset()
    setBatchCount(1)
  }

  const incrementBatch = () => {
    if (batchCount < 20) {
      setBatchCount((prev) => prev + 1)
      form.setValue("batch_count", batchCount + 1)
    }
  }

  const decrementBatch = () => {
    if (batchCount > 1) {
      setBatchCount((prev) => prev - 1)
      form.setValue("batch_count", batchCount - 1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo Kế hoạch Sản xuất Mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo kế hoạch sản xuất mới. Bạn sẽ tạo form cho từng lô sau bước này.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="planning_note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú kế hoạch (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập ghi chú về kế hoạch sản xuất..." className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>Thông tin bổ sung về kế hoạch sản xuất</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Số lượng lô sản xuất *</FormLabel>
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" size="sm" onClick={decrementBatch} disabled={batchCount <= 1}>
                  <Minus className="w-4 h-4" />
                </Button>

                <div className="flex-1 max-w-32">
                  <Input
                    type="number"
                    value={batchCount}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(20, Number.parseInt(e.target.value) || 1))
                      setBatchCount(value)
                      form.setValue("batch_count", value)
                    }}
                    min={1}
                    max={20}
                    className="text-center"
                  />
                </div>

                <Button type="button" variant="outline" size="sm" onClick={incrementBatch} disabled={batchCount >= 20}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <FormDescription>Số lượng lô sản xuất trong kế hoạch này (tối đa 20 lô)</FormDescription>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
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
