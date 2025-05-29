"use client"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportMultipleQRCodesToPDF } from "@/utils/print";
import { toast } from "sonner";

export default function StageActions({
    stage,
    selectedCount,
    selectedSerials,
    onNext,
    onReject,
    onCancel,
    loading = false,
}) {
    const handlePrintSerial = () => {
        console.log("selectedSerials", selectedSerials);
        exportMultipleQRCodesToPDF(selectedSerials);
        toast.success("Đã tạo file PDF thành công");
    }

    const getActionButtons = () => {
        switch (stage.id) {
            case "pending":
                return (
                    <>
                        <Button variant="outline" onClick={onReject} disabled={loading}>
                            Từ chối ({selectedCount})
                        </Button>
                        <Button onClick={onNext} className="bg-green-600 hover:bg-green-700" disabled={loading}>
                            Duyệt sản xuất ({selectedCount})
                        </Button>
                    </>
                )

            case "assembly":
                return (
                    <>
                        <Button variant="destructive" onClick={onCancel} disabled={loading}>
                            Huỷ sản xuất ({selectedCount})
                        </Button>
                        <Button variant="outline" className="border-yellow-300" onClick={handlePrintSerial} disabled={loading}>
                            In mã Serial ({selectedCount})
                        </Button>
                        <Button onClick={onNext} className="bg-green-600 hover:bg-green-700" disabled={loading}>
                            Hoàn thành lắp ráp ({selectedCount})
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </>
                )

            case "qc":
                return (
                    <>
                        <Button variant="destructive" onClick={onReject} disabled={loading}>
                            Từ chối ({selectedCount})
                        </Button>
                        <Button onClick={onNext} className="bg-green-600 hover:bg-green-700" disabled={loading}>
                            Hoàn thành kiểm tra ({selectedCount})
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </>
                )

            default:
                return null
        }
    }

    return <div className="flex justify-end space-x-2">{getActionButtons()}</div>
}
