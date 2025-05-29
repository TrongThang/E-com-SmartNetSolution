"use client"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import SerialTable from "./SerialTable"
import StageActions from "./StageActions"
import ModalFormQC from "./ModalFormQC"
import sseService from "@/services/sse.service"

export default function StateDetails({
    serialsByStage,
    stage,
    selectedSerials,
    onSelectSerial,
    onNextStage,
    onRejectQC,
    loading = false,
}) {
    const [isShowModalQcReject, setIsShowModalQcReject] = useState(false)
    const [formData, setFormData] = useState({
        reason: "",
        note: "",
    })

    const stageSerials = serialsByStage[stage.id] || []
    const selectedCount = selectedSerials.length

    const handleNext = () => {
        if (selectedCount === 0) {
            Swal.fire({
                icon: "warning",
                title: "Chưa chọn serial",
                text: "Vui lòng chọn ít nhất một serial để tiếp tục",
            })
            return
        }
        onNextStage(selectedSerials, stage.id)
    }

    const handleReject = () => {
        if (stage.id === "qc") {
            setIsShowModalQcReject(true)
        } else {
            // Handle other rejection logic
            console.log("Reject for stage:", stage.id)
        }
    }

    const handleSubmitModalQcReject = (e) => {
        e.preventDefault()
        if (formData.reason === "") {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng chọn lý do từ chối",
            })
            return
        }

        if (selectedCount === 0) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng chọn serial để từ chối",
            })
            return
        }

        onRejectQC(selectedSerials, formData.reason, formData.note)
        setIsShowModalQcReject(false)
        setFormData({ reason: "", note: "" })
    }

    const getStageInfo = () => {
        switch (stage.id) {
            case "pending":
                return {
                    title: "Duyệt sản xuất",
                    description: "Bạn có thể duyệt hoặc từ chối các serial bên dưới để bắt đầu quá trình sản xuất.",
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-900",
                    descColor: "text-blue-700",
                }
            case "assembly":
                return {
                    title: "Lắp ráp, gắn nhãn và nạp firmware thiết bị ",
                    description: "Ghi chú tiến độ lắp ráp, gắn nhãn và nạp firmware cho từng serial và cập nhật trạng thái.",
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-900",
                    descColor: "text-blue-700",
                }
            case "qc":
                return {
                    title: "Kiểm tra chất lượng",
                    description: "Kiểm tra chất lượng sản phẩm và quyết định chấp nhận hoặc từ chối.",
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-900",
                    descColor: "text-blue-700",
                }
            default:
                return {
                    title: "Sản phẩm hoàn thành",
                    description: "Các sản phẩm đã hoàn thành tất cả giai đoạn sản xuất.",
                    bgColor: "bg-green-50",
                    textColor: "text-green-900",
                    descColor: "text-green-700",
                }
        }
    }

    const stageInfo = getStageInfo()
    useEffect(() => {
        console.log("StageDetails - serialsByStage:", serialsByStage);
    }, [serialsByStage]);
    return (
        <div className="space-y-4">
            <div className={`${stageInfo.bgColor} p-4 rounded-lg `}>
                <h3 className={`font-medium ${stageInfo.textColor} mb-2`}>{stageInfo.title}</h3>
                <p className={`text-sm ${stageInfo.descColor}`}>{stageInfo.description}</p>
            </div>

            <SerialTable
                serials={stageSerials}
                stageId={stage.id}
                isCheckable={stage.id !== "completed"}
                selectedSerials={selectedSerials}
                onSelectSerial={onSelectSerial}
            />

            <StageActions
                stage={stage}
                selectedCount={selectedCount}
                selectedSerials={selectedSerials}
                onNext={handleNext}
                onReject={handleReject}
                loading={loading}
            />

            {isShowModalQcReject && (
                <ModalFormQC
                    setFormData={setFormData}
                    formData={formData}
                    onClose={() => setIsShowModalQcReject(false)}
                    onSubmit={handleSubmitModalQcReject}
                />
            )}
        </div>
    )
}
