"use client"
import { Button } from "@/components/ui/button"
import { exportMultipleQRCodesToPDF } from "@/utils/print";
import Swal from "sweetalert2";

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
        if (selectedSerials.length === 0) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Vui lòng chọn sản phẩm để in mã Serial',
                icon: 'warning',
            });
            return;
        }
        console.log("selectedSerials", selectedSerials);
        exportMultipleQRCodesToPDF(selectedSerials);
    }

    const getActionButtons = () => {
        switch (stage.id) {
            case "pending":
                return (
                    <>
                        <Button variant="outline" className="border-red-500 bg-red-500 hover:bg-red-300" onClick={onCancel} disabled={loading}>
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
                        <Button variant="outline"
                            className="border-blue-500 bg-yellow-300 hover:bg-yellow-300"
                            onClick={handlePrintSerial} disabled={loading}
                        >
                            In mã Serial ({selectedCount})
                        </Button>
                    </>
                )

            case "qc":
                return (
                    <>
                        <Button variant="destructive" onClick={onReject} disabled={loading}>
                            Từ chối ({selectedCount})
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={onReject} disabled={loading}>
                            Duyệt ({selectedCount})
                        </Button>
                    </>
                )

            default:
                return null
        }
    }

    return <div className="flex justify-end space-x-2">{getActionButtons()}</div>
}
