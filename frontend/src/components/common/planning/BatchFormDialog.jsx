import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

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
    defaultValues: {
      template_id: "",
      quantity: 1,
      batch_note: "",
      firmware_id: "",
    },
  });

  const { setError, clearErrors, handleSubmit } = form;

  const selectedTemplateId = form.watch("template_id");
  const selectedTemplate = templates.find((t) => t.template_id.toString() === selectedTemplateId);

  const availableFirmwares = useMemo(() => {
    return selectedTemplate?.firmware?.filter(firmware => {
      return firmware.is_approved && !firmware.is_deleted;
    }) || [];
  }, [selectedTemplate]);

  const validateForm = (data) => {
    let isValid = true;
    clearErrors();

    if (!data.template_id) {
      setError("template_id", { message: "Vui lòng chọn thiết bị" });
      isValid = false;
    }

    if (!data.firmware_id) {
      setError("firmware_id", { message: "Vui lòng chọn firmware" });
      isValid = false;
    } else if (selectedTemplate?.firmware?.length > 0) {
      const firmwareExists = selectedTemplate.firmware.some(f => f.firmware_id.toString() === data.firmware_id);
      if (!firmwareExists) {
        setError("firmware_id", { message: "Firmware không thuộc thiết bị này" });
        isValid = false;
      }
    }

    if (!data.quantity || data.quantity < 1) {
      setError("quantity", { message: "Số lượng phải lớn hơn 0" });
      isValid = false;
    } else if (data.quantity > 10000) {
      setError("quantity", { message: "Số lượng không được quá 10,000" });
      isValid = false;
    }

    return isValid;
  };

  const onFormSubmit = async (data) => {
    if (!validateForm(data)) return;

    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.message || "Có lỗi xảy ra khi tạo lô",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const progress = totalBatches > 0 ? ((currentBatch - 1) / totalBatches) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo Lô {currentBatch}/{totalBatches}</DialogTitle>
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
              <span>{currentBatch - 1}/{totalBatches}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="template_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thiết bị" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templates.length > 0 ? (
                            templates.map((template) => (
                              <SelectItem
                                key={template.template_id}
                                value={template.template_id.toString()}
                              >
                                {template.name || 'Không có tên'}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-templates" disabled>
                              Không có thiết bị
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>Chọn thiết bị sản xuất</FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {selectedTemplate && (
                  <FormField
                    control={form.control}
                    name="firmware_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firmware *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={availableFirmwares.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                availableFirmwares.length > 0
                                  ? "Chọn firmware"
                                  : "Không có firmware"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableFirmwares.map((firmware) => (
                              <SelectItem
                                key={firmware.firmware_id}
                                value={firmware.firmware_id.toString()}
                              >
                                {firmware.name} (v{firmware.version})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Chọn firmware cho lô sản xuất</FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng *</FormLabel>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.value > 1 && field.onChange(field.value - 1)}
                        disabled={field.value <= 1}
                      >
                        -
                      </Button>
                      <div className="flex-1 max-w-32">
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => {
                            let value = Number.parseInt(e.target.value) || 1;
                            value = Math.max(1, Math.min(10000, value));
                            field.onChange(value);
                          }}
                          className="text-center"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.value < 10000 && field.onChange(field.value + 1)}
                        disabled={field.value >= 10000}
                      >
                        +
                      </Button>
                    </div>
                    <FormDescription>Số lượng sản phẩm (tối đa 10,000)</FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch_note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú lô</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ghi chú..." className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Thông tin bổ sung về lô sản xuất</FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="text-red-500 text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang xử lý..." : currentBatch === totalBatches ? "Hoàn thành" : "Tiếp tục"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}