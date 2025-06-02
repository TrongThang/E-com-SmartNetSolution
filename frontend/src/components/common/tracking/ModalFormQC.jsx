"use client"
import { AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function ModalFormQC({ isOpen, onClose, onSubmit, formData, setFormData, selectedCount}) {
    const reasons = [
        { value: "serial_blur", label: "Mờ serial", description: "Serial không rõ ràng, khó đọc" },
        { value: "product_error", label: "Lỗi sản phẩm", description: "Sản phẩm có lỗi kỹ thuật" },
        { value: "all_error", label: "Mờ serial và lỗi sản phẩm", description: "Cả hai vấn đề trên" },
    ]  

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Từ chối sản phẩm
                    </DialogTitle>
                    <DialogDescription>
                        Bạn đang từ chối <Badge variant="destructive">{selectedCount}</Badge> sản phẩm. Vui lòng chọn lý do và ghi
                        chú thêm thông tin.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm font-medium">
                            Lý do từ chối <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="-- Chọn lý do từ chối --" />
                            </SelectTrigger>
                            <SelectContent>
                                {reasons.map((reason) => (
                                    <SelectItem key={reason.value} value={reason.value}>
                                        <div>
                                            <div className="font-medium">{reason.label}</div>
                                            <div className="text-xs text-gray-500">{reason.description}</div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note" className="text-sm font-medium">
                            Ghi chú thêm
                        </Label>
                        <Textarea
                            id="note"
                            placeholder="Mô tả chi tiết về vấn đề..."
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="destructive">
                            Xác nhận từ chối
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
