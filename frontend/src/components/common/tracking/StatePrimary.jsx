"use client"
import { useState, useEffect } from "react"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductionOverview from "./ProductionOverview"
import StateTimeline from "./StateTimeline"
import StageDetails from "./StageDetails"
import ModalFormQC from "./ModalFormQC"
import Swal from "sweetalert2"
import { useManufacturing } from "@/hooks/useManufacturing"
import NotificationBar from "./NotificationBar"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axiosIOTPublic from "@/apis/clients/iot.private.client"
import { useNavigate, useLocation } from "react-router-dom"

export default function StatePrimary() {
    const navigate = useNavigate()
    const location = useLocation()
    const { serialsByStage, setSerialsByStage } = useManufacturing()
    const { rejectQC, approveQC } = useManufacturing()
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [selectedStage, setSelectedStage] = useState("pending")
    const [selectedSerials, setSelectedSerials] = useState({})
    const [loading, setLoading] = useState(false)
    const [isQCModalOpen, setIsQCModalOpen] = useState(false)
    const [isRefresh, setIsRefresh] = useState(false)
    const [qcFormData, setQcFormData] = useState({ reason: "", note: "" })
    const [selectedBatch, setSelectedBatch] = useState()
    const [listBatch, setListBatch] = useState([])

    const stages = [
        { id: "pending", label: "Chờ duyệt", description: "Duyệt hoặc từ chối các serial để bắt đầu sản xuất" },
        { id: "assembly", label: "Sản xuất", description: "Lắp ráp, gắn nhãn và nạp firmware thiết bị" },
        { id: "qc", label: "Kiểm thử", description: "Kiểm tra chất lượng và quyết định chấp nhận hoặc từ chối" },
        { id: "completed", label: "Hoàn thành", description: "Các sản phẩm đã hoàn thành tất cả giai đoạn" },
    ]

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        
        const batchFromUrl = searchParams.get('batch')
        if (!batchFromUrl) {
            // Nếu không có batch trong URL, chuyển về trang danh sách lô
            navigate('/production-batches')
            return
        }
        setSelectedBatch(batchFromUrl)
    }, [])

    useEffect(() => {
        const fetchListBatch = async () => {
            try {
                const result = await axiosIOTPublic.get("production-batches");
                setIsInitialLoading(true)

                if (result.success) {
                    setListBatch(result.data);
                }
            } catch (error) {
                console.error("Error fetching list batch:", error)
            } finally {
                setIsInitialLoading(false)
            }
        }
        fetchListBatch();
    }, [])

    const handleChangeBatch = (newBatchId) => {
        if (newBatchId === selectedBatch) return // Không làm gì nếu chọn lại lô hiện tại
        
        // Cập nhật URL và state
        updateUrlBatch(newBatchId)
        setSelectedBatch(newBatchId)
        // Reset các state liên quan
        setSelectedSerials({})
        setSelectedStage("pending")

        setTimeout(() => {
            setSelectedBatch(newBatchId)
            setLoading(false)
        }, 500)
    }

    useEffect(() => {
        if (!selectedBatch) return

        const fetchProductionTrackingData = async () => {
            try {
                setLoading(true)
                const result = await axiosIOTPublic.get(`production-tracking/production-batch/${selectedBatch}`)
                if (result.success) {
                    setSerialsByStage(result.data)
                }
            } catch (error) {
                console.error("Error fetching production tracking data:", error)
            } finally {
                setIsInitialLoading(false)
                setLoading(false)
            }
        }

        fetchProductionTrackingData()
    }, [isRefresh, selectedBatch])

    const updateUrlBatch = (batchId) => {
        const searchParams = new URLSearchParams(location.search)
        searchParams.set('batch', batchId)
        navigate(`?${searchParams.toString()}`, { replace: true })
    }

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

    const handleApprove = async (e) => {
        if (selectedStage === "qc") {
            e.preventDefault()
        }

        if (currentSelectedSerials.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng chọn serial để duyệt",
            })
            return
        }

        try {
            await approveQC(currentSelectedSerials, qcFormData.note)

            setSelectedSerials([])
        } catch (error) {
            console.error("Error approving QC:", error)
        }
        
        Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Duyệt sản phẩm thành công",
        })
    }

    if (isInitialLoading || loading) {
        return <div className="flex justify-center items-center h-screen text-blue-500 font-bold">
            <Loader2 className="w-20 h-20 animate-spin" />
        </div>
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
                            <Select
                                value={selectedBatch}
                                onValueChange={handleChangeBatch}
                                disabled={loading || isInitialLoading}
                            >
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue placeholder="Chọn lô" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {listBatch.map((batch) => (
                                            <SelectItem key={batch.production_batch_id} value={batch.production_batch_id}
                                                className="flex justify-between items-center gap-2"
                                            >
                                                <span className="font-medium text-sm mr-2">{batch.production_batch_id}</span>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    ({batch.quantity} sản phẩm)
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm" onClick={() => setIsRefresh(!isRefresh)}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Làm mới
                            </Button>
                        </div>
                    </div>

                    {/* Overview Stats */}
                    <ProductionOverview serialsByStage={serialsByStage} />
                </div>

                {/* Notification Bar */}
                <NotificationBar />

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
                            onApprove={handleApprove}
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
