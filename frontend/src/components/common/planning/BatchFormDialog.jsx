"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

const batchSchema = z.object({
  template_id: z.string().min(1, "Template là bắt buộc"),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0").max(10000, "Số lượng không được quá 10,000"),
  batch_note: z.string().optional(),
  firmware_id: z.string().optional(),
})

export function BatchFormDialog({
  isOpen,
  onClose,
  onSubmit,
  templates,
  isSubmitting,
  currentBatch,
  totalBatches,
  planningNote,
}) {
  const form = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      template_id: "",
      quantity: 1,
      batch_note: "",
      firmware_id: "none",
    },
  })

  // Get selected template's firmwares
  const selectedTemplateId = form.watch("template_id")
  const selectedTemplate = templates.find(t => t.template_id.toString() === selectedTemplateId)
  const availableFirmwares = selectedTemplate?.firmware || []

  const handleSubmit = async (data) => {
    // Convert "none" to null for firmware_id
    const submitData = {
      ...data,
      firmware_id: data.firmware_id === "none" ? null : data.firmware_id
    }
    await onSubmit(submitData)
    form.reset()
  }

  const progress = ((currentBatch - 1) / totalBatches) * 100

  // Chỉ lọc templates đã được duyệt
  const availableTemplates = templates.filter((template) => template.status === "success")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Tạo Lô {currentBatch}/{totalBatches}
          </DialogTitle>
          <DialogDescription>
            {planningNote && (
              <div className="mb-2">
                <strong>Kế hoạch:</strong> {planningNote}
              </div>
            )}
            Nhập thông tin cho lô sản xuất số {currentBatch}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tiến độ tạo lô</span>
              <span>
                {currentBatch - 1}/{totalBatches}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="template_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn template sản xuất" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTemplates.length > 0 ? (
                          availableTemplates.map((template) => (
                            <SelectItem key={template.template_id} value={template.template_id.toString()}>
                              <div className="flex flex-col">
                                <span>{template.name}</span>
                                {template.device_template_note && (
                                  <span className="text-xs text-gray-500">{template.device_template_note}</span>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-templates" disabled>
                            Không có template nào khả dụng
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Template sản xuất sẽ sử dụng ({availableTemplates.length} template khả dụng)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedTemplate && availableFirmwares.length > 0 && (
                <FormField
                  control={form.control}
                  name="firmware_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firmware (Tùy chọn)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn firmware" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            <span className="text-gray-500">Không chọn firmware</span>
                          </SelectItem>
                          {availableFirmwares.map((firmware) => (
                            <SelectItem key={firmware.firmware_id} value={firmware.firmware_id.toString()}>
                              <div className="flex flex-col">
                                <span>{firmware.name}</span>
                                <span className="text-xs text-gray-500">Version: {firmware.version}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Chọn firmware cho lô sản xuất này (nếu có)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Số lượng sản phẩm cần sản xuất trong lô này</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch_note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú lô (Tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập ghi chú về lô sản xuất này..." className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Thông tin bổ sung về lô sản xuất này</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Hủy tất cả
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang tạo..." : currentBatch === totalBatches ? "Hoàn thành" : "Lô tiếp theo"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
