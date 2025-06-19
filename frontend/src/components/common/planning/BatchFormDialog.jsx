import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";

export function BatchFormDialog({
  isOpen,
  onClose,
  onSubmit,
  templates,
  isSubmitting,
  planningNote,
  existingBatches = [],
  onBatchesChange,
}) {
  const [batches, setBatches] = useState(existingBatches);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    setBatches(existingBatches);
  }, [existingBatches]);

  const form = useForm({
    defaultValues: {
      template_id: "",
      quantity: 1,
      batch_note: "",
      firmware_id: "",
    },
  });

  const { setError, clearErrors, handleSubmit, reset, watch } = form;

  const selectedTemplateId = watch("template_id");
  const selectedTemplate = templates.find((t) => t.template_id.toString() === selectedTemplateId);

  const availableFirmwares = useMemo(() => {
    if (!selectedTemplate?.firmware) return [];
    return selectedTemplate.firmware.filter(firmware => {
      return firmware.is_approved && !firmware.is_deleted;
    });
  }, [selectedTemplate]);

  const validateForm = (data) => {
    let isValid = true;
    clearErrors();

    if (!data.template_id) {
      setError("template_id", { message: "Vui lòng chọn thiết bị" });
      isValid = false;
    }

    if (data.firmware_id && data.firmware_id !== "none" && selectedTemplate?.firmware?.length > 0) {
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

  const handleAddBatch = async (data) => {
    if (!validateForm(data)) return;

    try {
      const batchData = {
        template_id: data.template_id,
        quantity: Number(data.quantity),
        batch_note: data.batch_note || "",
        firmware_id: data.firmware_id && data.firmware_id !== "none" ? data.firmware_id : null,
      };

      let updatedBatches;
      if (editingIndex !== null) {
        updatedBatches = [...batches];
        updatedBatches[editingIndex] = batchData;
      } else {
        updatedBatches = [...batches, batchData];
      }

      setBatches(updatedBatches);
      if (onBatchesChange) {
        onBatchesChange(updatedBatches);
      }

      setEditingIndex(null);
      reset({
        template_id: "",
        quantity: 1,
        batch_note: "",
        firmware_id: "",
      });
      setIsAddingNew(false);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.message || "Có lỗi xảy ra khi thêm đơn sản xuất",
      });
    }
  };

  const handleEditBatch = (index) => {
    const batch = batches[index];
    reset({
      template_id: batch.template_id.toString(),
      quantity: batch.quantity,
      batch_note: batch.batch_note || "",
      firmware_id: batch.firmware_id ? batch.firmware_id.toString() : "",
    });
    setEditingIndex(index);
    setIsAddingNew(true);
  };

  const handleDeleteBatch = (index) => {
    const updatedBatches = batches.filter((_, i) => i !== index);
    setBatches(updatedBatches);
    if (onBatchesChange) {
      onBatchesChange(updatedBatches);
    }

    if (editingIndex === index) {
      setEditingIndex(null);
      setIsAddingNew(false);
      reset();
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsAddingNew(false);
    reset({
      template_id: "",
      quantity: 1,
      batch_note: "",
      firmware_id: "",
    });
  };

  const handleAddNewBatch = () => {
    setEditingIndex(null);
    reset({
      template_id: "",
      quantity: 1,
      batch_note: "",
      firmware_id: "",
    });
    setIsAddingNew(true);
  };

  const handleFinish = async () => {
    if (batches.length === 0) {
      setError("root", {
        type: "manual",
        message: "Vui lòng thêm ít nhất một đơn sản xuất",
      });
      return;
    }

    try {
      await onSubmit(batches);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.message || "Có lỗi xảy ra khi hoàn thành kế hoạch",
      });
    }
  };

  const handleClose = () => {
    setBatches([]);
    setEditingIndex(null);
    setIsAddingNew(false);
    reset({
      template_id: "",
      quantity: 1,
      batch_note: "",
      firmware_id: "",
    });
    if (onBatchesChange) {
      onBatchesChange([]);
    }
    onClose();
  };

  const getTemplateName = (templateId) => {
    const template = templates.find(t => t.template_id.toString() === templateId.toString());
    return template?.name || `Template ${templateId}`;
  };

  const getFirmwareInfo = (firmwareId, templateId) => {
    if (!firmwareId) return null;
    const template = templates.find(t => t.template_id.toString() === templateId.toString());
    const firmware = template?.firmware?.find(f => f.firmware_id.toString() === firmwareId.toString());
    return firmware ? `${firmware.name} (v${firmware.version})` : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quản lý Đơn Sản xuất</DialogTitle>
          <DialogDescription>
            {planningNote && (
              <div className="mb-2">
                <strong>Kế hoạch:</strong> {planningNote}
              </div>
            )}
            Thêm và quản lý các đơn sản xuất cho kế hoạch này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Danh sách đơn đã tạo */}
          {batches.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Đơn sản xuất đã tạo ({batches.length})</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Thiết bị</TableHead>
                    <TableHead>Firmware</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Ghi chú</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{getTemplateName(batch.template_id)}</TableCell>
                      <TableCell>
                        {getFirmwareInfo(batch.firmware_id, batch.template_id) || "Không có"}
                      </TableCell>
                      <TableCell>{batch.quantity}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {batch.batch_note || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBatch(index)}
                            disabled={isAddingNew}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBatch(index)}
                            disabled={isAddingNew}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Form thêm/chỉnh sửa đơn */}
          {isAddingNew && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">
                  {editingIndex !== null ? `Chỉnh sửa đơn ${editingIndex + 1}` : "Thêm đơn mới"}
                </h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={handleSubmit(handleAddBatch)} className="space-y-4">
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
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="firmware_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Firmware</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn firmware (không bắt buộc)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                Không có firmware
                              </SelectItem>
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
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
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
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="batch_note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú đơn sản xuất</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ghi chú..." className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Hủy
                    </Button>
                    <Button type="submit">
                      {editingIndex !== null ? "Cập nhật" : "Thêm"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Nút thêm đơn mới */}
          {!isAddingNew && (
            <div className="text-center">
              <Button
                type="button"
                onClick={handleAddNewBatch}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm đơn sản xuất
              </Button>
            </div>
          )}

          {form.formState.errors.root && (
            <div className="text-red-500 text-sm text-center">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Nút hoàn thành */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting || batches.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Đang xử lý..." : "Hoàn thành"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}