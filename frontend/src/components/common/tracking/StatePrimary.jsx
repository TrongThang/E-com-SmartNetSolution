"use client"
import { useState, useEffect } from "react"
import { RefreshCw, Settings, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductionOverview from "./ProductionOverview"
import StateTimeline from "./StateTimeline"
import StageDetails from "./StageDetails"
import ModalFormQC from "./ModalFormQC"
import axiosPublic from "@/apis/clients/public.client"
import axios from "axios"
import Swal from "sweetalert2"
import { useManufacturing } from "@/hooks/useManufacturing"


export default function StatePrimary() {
    const { serialsByStage,  fetchSerials, setSerialsByStage } = useManufacturing()
    const { rejectQC } = useManufacturing()
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [selectedStage, setSelectedStage] = useState("pending")
    const [selectedSerials, setSelectedSerials] = useState({})
    const [loading, setLoading] = useState(false)
    const [isQCModalOpen, setIsQCModalOpen] = useState(false)
    const [isRefresh, setIsRefresh] = useState(false)
    const [qcFormData, setQcFormData] = useState({ reason: "", note: "" })

    const stages = [
        { id: "pending", label: "Chờ duyệt", description: "Duyệt hoặc từ chối các serial để bắt đầu sản xuất" },
        { id: "assembly", label: "Sản xuất", description: "Lắp ráp, gắn nhãn và nạp firmware thiết bị" },
        { id: "qc", label: "Kiểm thử", description: "Kiểm tra chất lượng và quyết định chấp nhận hoặc từ chối" },
        { id: "completed", label: "Hoàn thành", description: "Các sản phẩm đã hoàn thành tất cả giai đoạn" },
    ]

    useEffect(() => {
        console.log("Before Fetching production tracking data")

        const fetchProductionTrackingData = async () => {
            try {
                const result = await axiosPublic.get("http://localhost:8888/api/production-tracking/production-batch/BATCH202406");
                if (result.success) {
                    setSerialsByStage(result.data);
                }
            } catch (error) {
                console.error("Error fetching production tracking data:", error);
            } finally {
                setIsInitialLoading(false)
            }
        };

        fetchProductionTrackingData();
    }, [isRefresh]);

    const handleSelectSerial = (serial) => {
        setSelectedSerials((prev) => ({
            ...prev,
            [selectedStage]: prev[selectedStage]?.includes(serial)
                ? prev[selectedStage].filter((s) => s !== serial)
                : [...(prev[selectedStage] || []), serial],
        }))

        console.log(selectedSerials)
    }

    const handleSelectAllSerial = (checked) => {
        const stageSerials = serialsByStage[selectedStage] || []
        setSelectedSerials((prev) => ({
            ...prev,
            [selectedStage]: checked ? stageSerials.map((s) => s.serial) : [],
        }))
    }

    const handleReject = () => {
        if (selectedStage === "qc") {
            setIsQCModalOpen(true)
        }
    }

    const currentStageSerials = serialsByStage[selectedStage] || []
    const currentSelectedSerials = selectedSerials[selectedStage] || []

    const handleSubmitModalQcReject = async (e) => {
        e.preventDefault()
        if (qcFormData.reason === "") {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng chọn lý do từ chối",
            })
            return
        }

        if (currentSelectedSerials.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng chọn serial để từ chối",
            })
            return
        }

        try {
            await rejectQC(currentSelectedSerials, qcFormData.reason, qcFormData.note)

            setSelectedSerials([])
        } catch (error) {
            console.error("Error rejecting QC:", error)
        }
        setQcFormData({ reason: "", note: "" })
        setIsQCModalOpen(false)
        Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Từ chối sản phẩm thành công",
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý sản xuất</h1>
                            <p className="text-gray-600 mt-1">Theo dõi và quản lý tiến độ sản xuất theo từng giai đoạn</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsRefresh(!isRefresh)}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Làm mới
                            </Button>
                            <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                Cài đặt
                            </Button>
                        </div>
                    </div>

                    {/* Overview Stats */}
                    <ProductionOverview serialsByStage={serialsByStage} />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Timeline */}
                    <div className="lg:col-span-1">
                        <StateTimeline
                            stages={stages}
                            serialsByStage={serialsByStage}
                            onStageSelect={setSelectedStage}
                            selectedStage={selectedStage}
                        />
                    </div>

                    {/* Stage Details */}
                    <div className="lg:col-span-2">
                        <StageDetails
                            stage={stages.find((s) => s.id === selectedStage) || stages[0]}
                            serials={currentStageSerials}
                            selectedSerials={currentSelectedSerials}
                            onSelectSerial={handleSelectSerial}
                            onSelectAllSerial={handleSelectAllSerial}
                            onReject={handleReject}
                            loading={loading}
                            setSelectedSerials={setSelectedSerials}
                        />
                    </div>
                </div>

                {/* QC Modal */}
                <ModalFormQC
                    formData={qcFormData}
                    setFormData={setQcFormData}
                    isOpen={isQCModalOpen}
                    onClose={() => setIsQCModalOpen(false)}
                    selectedCount={currentSelectedSerials.length}
                    onSubmit={handleSubmitModalQcReject}
                />
            </div>
        </div>
    )
}
