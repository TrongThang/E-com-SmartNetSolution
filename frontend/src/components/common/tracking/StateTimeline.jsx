"use client"
import { useState, useEffect } from "react"
import { Check, Circle, ChevronUp, ChevronDown, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import StageDetails from "./StageDetails"
import StageStats from "./StageStats"
import { useManufacturing } from "@/hooks/useManufacturing"
import axiosPublic from "@/apis/clients/public.client"
import { useParams } from "react-router-dom"

const StateTimeline = ({
    stages = [],
    currentStage = 0,
    size = "md",
    showLabels = true,
    showDescription = false,
    clickable = false,
    onStageClick,
    className = "",
    ...props
}) => {
    const { serialsByStage, loading, error, fetchSerials, rejectQC, setSerialsByStage } =
        useManufacturing()
    const { production_batch_id } = useParams()
    const [expandedStages, setExpandedStages] = useState({})
    const [serialsStageSelected, setSerialsStageSelected] = useState({
        pending: [],
        assembly: [],
        labeling: [],
        firmware_upload: [],
        qc: [],
        completed: [],
    })

    // Function to handle SSE updates
    const handleSerialUpdate = (device_serial, newStage, newStatus, stage_logs) => {
        setSerialsByStage(prevSerials => {
            const updatedSerials = { ...prevSerials };
    
            // Xóa serial khỏi tất cả các stage cũ
            Object.keys(updatedSerials).forEach(stage => {
                updatedSerials[stage] = updatedSerials[stage].filter(
                    serial => serial.serial !== device_serial
                );
            });
    
            // Thêm serial vào stage mới với stage_logs mới nhất từ backend
            if (!updatedSerials[newStage]) {
                updatedSerials[newStage] = [];
            }
    
            const updatedSerial = {
                serial: device_serial,
                status: newStatus,
                stage_logs: stage_logs // <-- Dùng trực tiếp mảng từ backend
            };
    
            updatedSerials[newStage].push(updatedSerial);
            return updatedSerials;
        });
    };
    

    useEffect(() => {
        const fetchProductionTrackingData = async () => {
            if (!serialsByStage || Object.keys(serialsByStage).length === 0) {
                try {
                    const result = await axiosPublic.get("http://localhost:8888/api/production-tracking/production-batch/BATCH202406");
                    if (result.success === true) {
                        setSerialsByStage(result.data);
                    }
                } catch (error) {
                    console.error("Error fetching production tracking data:", error);
                }
            }
        };

        fetchProductionTrackingData();
    }, []); // Only run once on mount
    
    const sizes = {
        sm: {
            circle: "w-6 h-6",
            icon: "w-3 h-3",
            text: "text-xs",
            connector: "h-0.5",
        },
        md: {
            circle: "w-8 h-8",
            icon: "w-4 h-4",
            text: "text-sm",
            connector: "h-1",
        },
        lg: {
            circle: "w-12 h-12",
            icon: "w-6 h-6",
            text: "text-base",
            connector: "h-1.5",
        },
    }

    const toggleStage = (stageId) => {
        setExpandedStages((prev) => ({
            ...prev,
            [stageId]: !prev[stageId],
        }))
    }

    const handleSelectSerial = (serial, stageId) => {
        setSerialsStageSelected((prev) => {
            const current = prev[stageId] || []
            const isSelected = current.includes(serial)

            return {
                ...prev,
                [stageId]: isSelected ? current.filter((s) => s !== serial) : [...current, serial],
            }
        })
    }

    const handleSelectAllSerial = (stageId, checked) => {
        setSerialsStageSelected((prev) => ({
            ...prev,
            [stageId]: checked ? serialsByStage[stageId].map((serial) => serial.serial) : [],
        }))
    }

    const handleRejectQC = async (selectedSerials, reason, note) => {
        try {
            await rejectQC(selectedSerials, reason, note)
            // Clear selection after successful rejection
            setSerialsStageSelected((prev) => ({
                ...prev,
                qc: [],
            }))
        } catch (error) {
            console.error("Error rejecting QC:", error)
        }
    }

    const getStageStatus = (index, stage) => {
        const stageSerials = serialsByStage[stage.id] || []

        if (stageSerials.length === 0) return "empty"

        const hasInProgress = stageSerials.some(
            (serial) => serial.status === "in_progress" || serial.status === "pending_approval",
        )
        const hasCompleted = stageSerials.some((serial) => serial.status === "completed")
        const hasFailed = stageSerials.some((serial) => serial.status === "fixing" || serial.status === "failed")

        if (hasInProgress) return "current"
        if (hasFailed) return "warning"
        if (hasCompleted && index <= currentStage) return "completed"

        return "pending"
    }

    const getStageIcon = (stage, status, index) => {
        if (stage.icon) return stage.icon

        switch (status) {
            case "completed":
                return <Check className={sizes[size].icon} />
            case "current":
                return <Circle className={sizes[size].icon} fill="currentColor" />
            case "warning":
                return <AlertCircle className={sizes[size].icon} />
            case "empty":
                return <span className={cn("font-semibold", sizes[size].text)}>{index + 1}</span>
            default:
                return <span className={cn("font-semibold", sizes[size].text)}>{index + 1}</span>
        }
    }

    const getStageColors = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-500 text-white border-green-500"
            case "current":
                return "bg-blue-500 text-white border-blue-500"
            case "warning":
                return "bg-yellow-500 text-white border-yellow-500"
            case "empty":
                return "bg-gray-100 text-gray-400 border-gray-200"
            default:
                return "bg-gray-200 text-gray-500 border-gray-300"
        }
    }

    const handleStageClick = (index, stage) => {
        if (clickable && onStageClick) {
            onStageClick(index, stage)
        }
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500 mb-2">Có lỗi xảy ra: {error}</div>
                <button onClick={fetchSerials} className="text-blue-500 hover:underline">
                    Thử lại
                </button>
            </div>
        )
    }

    return (
        <div className={cn("space-y-4", className)} {...props}>
            {stages.map((stage, index) => {
                const isExpanded = expandedStages[stage.id]
                const status = getStageStatus(index, stage)
                const stageSerials = serialsByStage[stage.id] || []

                return (
                    <div key={index}>
                        <div className="flex items-start space-x-3">
                            <div
                                className={cn(
                                    "flex items-center justify-center rounded-full border-2 flex-shrink-0",
                                    sizes[size].circle,
                                    getStageColors(status),
                                    clickable && "cursor-pointer hover:scale-105 transition-transform",
                                )}
                                onClick={() => handleStageClick(index, stage)}
                            >
                                {getStageIcon(stage, status, index)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        {showLabels && (
                                            <h3
                                                className={cn(
                                                    "font-medium",
                                                    sizes[size].text,
                                                    status === "current" ? "text-blue-600" : "text-gray-900",
                                                )}
                                            >
                                                {stage.label}
                                            </h3>
                                        )}
                                    </div>

                                    <StageStats serials={stageSerials} />
                                </div>
                            </div>
                            <button
                                onClick={() => toggleStage(stage.id)}
                                className="ml-2 focus:outline-none hover:bg-gray-100 p-1 rounded"
                                disabled={loading}
                            >
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                        </div>

                        {isExpanded && (
                            <div className="mt-4 pl-12">
                                <StageDetails
                                    serialsByStage={serialsByStage}
                                    stage={stage}
                                    selectedSerials={serialsStageSelected[stage.id] || []}
                                    onSelectAllSerial={(checked) => handleSelectAllSerial(stage.id, checked)}
                                    onSelectSerial={(serial) => handleSelectSerial(serial, stage.id)}
                                    onRejectQC={handleRejectQC}
                                    loading={loading}
                                    onUpdateSerials={handleSerialUpdate}
                                />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default StateTimeline
