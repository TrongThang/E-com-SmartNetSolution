"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Calendar } from "lucide-react"
import Swal from "sweetalert2"

import { PlanningTable } from "@/components/common/planning/PlanningTable"
import { CreatePlanningDialog } from "@/components/common/planning/CreatePlanningDialog"
import { BatchFormDialog } from "@/components/common/planning/BatchFormDialog"
import { PlanningDetailsDialog } from "@/components/common/planning/PlanningDetailsDialog"
import { PlanningApprovalDialog } from "@/components/common/planning/PlanningApprovalDialog"
import { StatusUpdateDialog } from "@/components/common/batch/StatusUpdateDialog"
import { BatchDetailsDialog } from "@/components/common/batch/BatchDetailsDialog"
import { calculatePlanningStatus } from "@/components/common/planning/planningStatusUtils"

// Mock current user
const currentUser = {
  id: "user001",
  name: "Nguyễn Văn A",
  role: "manager",
}

// Generate functions
const generatePlanningId = () => {
  const timestamp = Date.now().toString(36)
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `PLAN${timestamp}${randomString}`
}

const generateProductionBatchId = () => {
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `PROD${randomString}`
}

const generateDeviceSerials = (quantity, batchId) => {
  const serials = []
  for (let i = 1; i <= quantity; i++) {
    const serial = `${batchId}-${i.toString().padStart(4, "0")}`
    serials.push(serial)
  }
  return serials
}

// Mock data cho templates (bỏ device_type_id)
const mockTemplates = [
  {
    template_id: 1,
    name: "Camera IP Wifi V1",
    created_by: "user001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    is_deleted: false,
    status: "success",
    device_template_note: "Template cơ bản cho camera IP",
    firmware: [
      {
        firmware_id: 1,
        name: "Camera IP Wifi V1.0",
        version: "1.0.0",
        file_path: "/firmware/camera-ip-wifi-v1.0.bin",
        is_mandatory: true,
        is_approved: true,
      },
      {
        firmware_id: 2,
        name: "Camera IP Wifi V1.1",
        version: "1.1.0",
        file_path: "/firmware/camera-ip-wifi-v1.1.bin",
        is_mandatory: false,
        is_approved: true,
      }
    ]
  },
  {
    template_id: 2,
    name: "Camera IP POE V2",
    created_by: "user001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    is_deleted: false,
    status: "success",
    device_template_note: "Template nâng cao với POE",
  },
  {
    template_id: 3,
    name: "LED Strip RGB V1",
    created_by: "user002",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    is_deleted: false,
    status: "success",
    device_template_note: "Dải LED RGB điều khiển từ xa",
  },
  {
    template_id: 4,
    name: "LED Bulb Smart V1",
    created_by: "user002",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    is_deleted: false,
    status: "success",
    device_template_note: "Bóng đèn LED thông minh",
  },
  {
    template_id: 5,
    name: "Temperature Sensor V1",
    created_by: "user003",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    is_deleted: false,
    status: "success",
    device_template_note: "Cảm biến nhiệt độ độ chính xác cao",
  },
  {
    template_id: 6,
    name: "Camera IP 4K V1",
    created_by: "user001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    is_deleted: false,
    status: "pending",
    device_template_note: "Template đang chờ duyệt",
  },
]

// Mock data với Planning structure (bỏ paused status)
const mockPlannings = [
  {
    planning_id: "PLAN001",
    status: "in_progress",
    created_by: "user001",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    is_deleted: false,
    planning_note: "Kế hoạch sản xuất tháng 1 - Đơn hàng khẩn cấp",
    batches: [
      {
        batch_id: 1,
        planning_id: "PLAN001",
        production_batch_id: "PRODABC123",
        template_id: 1,
        template_name: "Camera IP Wifi V1",
        quantity: 100,
        status: "in_progress",
        created_at: "2024-01-15T08:00:00Z",
        updated_at: "2024-01-20T14:30:00Z",
        is_deleted: false,
        batch_note: "Lô chính của kế hoạch",
      },
      {
        batch_id: 2,
        planning_id: "PLAN001",
        production_batch_id: "PRODDEF456",
        template_id: 3,
        template_name: "LED Strip RGB V1",
        quantity: 50,
        status: "pendingimport",
        created_at: "2024-01-15T08:30:00Z",
        updated_at: "2024-01-18T16:45:00Z",
        is_deleted: false,
        batch_note: "Lô phụ hỗ trợ",
      },
    ],
  },
  {
    planning_id: "PLAN002",
    status: "fix",
    created_by: "user002",
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-22T14:00:00Z",
    is_deleted: false,
    planning_note: "Kế hoạch sản xuất LED Module",
    batches: [
      {
        batch_id: 3,
        planning_id: "PLAN002",
        production_batch_id: "PRODREL001",
        template_id: 4,
        template_name: "LED Bulb Smart V1",
        quantity: 80,
        status: "relabeling",
        created_at: "2024-01-20T10:00:00Z",
        updated_at: "2024-01-22T14:00:00Z",
        is_deleted: false,
        batch_note: "Cần dán lại nhãn do lỗi in ấn",
      },
    ],
  },
  {
    planning_id: "PLAN003",
    status: "pending",
    created_by: "user003",
    created_at: "2024-01-28T08:00:00Z",
    updated_at: "2024-01-28T08:00:00Z",
    is_deleted: false,
    planning_note: "Kế hoạch test chức năng mới",
    batches: [
      {
        batch_id: 4,
        planning_id: "PLAN003",
        production_batch_id: "PRODTEST123",
        template_id: 5,
        template_name: "Temperature Sensor V1",
        quantity: 10,
        status: "pending",
        created_at: "2024-01-28T08:00:00Z",
        updated_at: "2024-01-28T08:00:00Z",
        is_deleted: false,
        batch_note: "Lô test để kiểm tra chức năng duyệt",
      },
    ],
  },
]

// Cập nhật status cho plannings dựa trên batches
mockPlannings.forEach((planning) => {
  planning.status = calculatePlanningStatus(planning.batches)
})

export default function ProductionPlanningManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Dialog states
  const [isCreatePlanningDialogOpen, setIsCreatePlanningDialogOpen] = useState(false)
  const [isBatchFormDialogOpen, setIsBatchFormDialogOpen] = useState(false)
  const [isPlanningDetailsDialogOpen, setIsPlanningDetailsDialogOpen] = useState(false)
  const [isBatchDetailsDialogOpen, setIsBatchDetailsDialogOpen] = useState(false)
  const [isPlanningApprovalDialogOpen, setIsPlanningApprovalDialogOpen] = useState(false)
  const [isStatusUpdateDialogOpen, setIsStatusUpdateDialogOpen] = useState(false)

  // Selected items
  const [selectedPlanningForDetails, setSelectedPlanningForDetails] = useState(null)
  const [selectedBatchForDetails, setSelectedBatchForDetails] = useState(null)
  const [selectedPlanningForApproval, setSelectedPlanningForApproval] = useState(null)
  const [selectedBatchForStatusUpdate, setSelectedBatchForStatusUpdate] = useState(null)

  // Batch creation flow
  const [currentBatchCreation, setCurrentBatchCreation] = useState({
    planning: null,
    currentBatch: 1,
    totalBatches: 0,
    createdBatches: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredPlannings = mockPlannings.filter((planning) => {
    const matchesSearch =
      planning.planning_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planning.planning_note?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || planning.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus && !planning.is_deleted
  })

  // Cập nhật permission functions
  const canApprovePlanning = (planning) => {
    return currentUser.role === "manager" && planning.status === "pending"
  }

  const canUpdateBatchStatus = (batch) => {
    return (
      currentUser.role === "manager" &&
      ["in_progress", "pendingimport", "relabeling", "fixproduction"].includes(batch.status)
    )
  }

  const handleCreatePlanning = async (data) => {
    setIsSubmitting(true)
    try {
      const planningId = generatePlanningId()

      const newPlanning = {
        planning_id: planningId,
        status: "pending",
        created_by: currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false,
        planning_note: data.planning_note || null,
        batches: [],
      }

      // Khởi tạo flow tạo batch
      setCurrentBatchCreation({
        planning: newPlanning,
        currentBatch: 1,
        totalBatches: data.batch_count,
        createdBatches: [],
      })

      setIsCreatePlanningDialogOpen(false)
      setIsBatchFormDialogOpen(true)
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi tạo kế hoạch",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateBatch = async (data) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const productionBatchId = generateProductionBatchId()
      const deviceSerials = generateDeviceSerials(data.quantity, productionBatchId)

      // Tìm thông tin template và firmware
      const template = mockTemplates.find((t) => t.template_id === Number.parseInt(data.template_id))
      const firmware = template?.firmware?.find(f => f.firmware_id === Number.parseInt(data.firmware_id))

      const newBatch = {
        batch_id: Date.now() + currentBatchCreation.currentBatch,
        planning_id: currentBatchCreation.planning.planning_id,
        production_batch_id: productionBatchId,
        template_id: Number.parseInt(data.template_id),
        template_name: template?.name || data.template_id,
        quantity: data.quantity,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false,
        batch_note: data.batch_note || null,
        device_serials: deviceSerials,
        firmware_id: firmware?.firmware_id || null,
        firmware_name: firmware?.name || null,
        firmware_version: firmware?.version || null,
      }

      const updatedCreatedBatches = [...currentBatchCreation.createdBatches, newBatch]

      if (currentBatchCreation.currentBatch >= currentBatchCreation.totalBatches) {
        // Hoàn thành tạo tất cả lô
        const completedPlanning = {
          ...currentBatchCreation.planning,
          batches: updatedCreatedBatches,
          status: calculatePlanningStatus(updatedCreatedBatches),
        }

        mockPlannings.unshift(completedPlanning)

        await Swal.fire({
          icon: "success",
          title: "🎉 Tạo kế hoạch thành công!",
          html: `
            <div class="text-left">
              <p><strong>Mã kế hoạch:</strong> ${completedPlanning.planning_id}</p>
              <p><strong>Số lô đã tạo:</strong> ${updatedCreatedBatches.length}/${currentBatchCreation.totalBatches}</p>
              <p><strong>Trạng thái:</strong> ${completedPlanning.status}</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: "📋 Xem chi tiết",
          cancelButtonText: "✅ OK",
          confirmButtonColor: "#3b82f6",
          cancelButtonColor: "#10b981",
        }).then((result) => {
          if (result.isConfirmed) {
            setSelectedPlanningForDetails(completedPlanning)
            setIsPlanningDetailsDialogOpen(true)
          }
        })

        setIsBatchFormDialogOpen(false)
        setCurrentBatchCreation({
          planning: null,
          currentBatch: 1,
          totalBatches: 0,
          createdBatches: [],
        })
      } else {
        // Tiếp tục tạo lô tiếp theo
        setCurrentBatchCreation({
          ...currentBatchCreation,
          currentBatch: currentBatchCreation.currentBatch + 1,
          createdBatches: updatedCreatedBatches,
        })
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi tạo lô",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePlanningApproval = async (data) => {
    if (!selectedPlanningForApproval) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const planningIndex = mockPlannings.findIndex((p) => p.planning_id === selectedPlanningForApproval.planning_id)

      if (planningIndex !== -1) {
        if (data.action === "approve") {
          // Phê duyệt: chuyển tất cả lô sang in_progress
          mockPlannings[planningIndex].batches.forEach((batch) => {
            if (batch.status === "pending") {
              batch.status = "in_progress"
              batch.updated_at = new Date().toISOString()
            }
          })
          mockPlannings[planningIndex].status = "in_progress"
        } else {
          // Từ chối: chuyển planning sang rejected và tất cả lô sang cancelled
          mockPlannings[planningIndex].status = "rejected"
          mockPlannings[planningIndex].batches.forEach((batch) => {
            if (batch.status === "pending") {
              batch.status = "cancelled"
              batch.updated_at = new Date().toISOString()
            }
          })
        }

        mockPlannings[planningIndex].updated_at = new Date().toISOString()
      }

      await Swal.fire({
        icon: data.action === "approve" ? "success" : "warning",
        title: data.action === "approve" ? "Phê duyệt thành công!" : "Đã từ chối!",
        text: `Kế hoạch ${selectedPlanningForApproval.planning_id} đã được ${data.action === "approve" ? "phê duyệt và bắt đầu sản xuất" : "từ chối và hủy tất cả lô"
          }`,
        timer: 2000,
        showConfirmButton: false,
      })

      setIsPlanningApprovalDialogOpen(false)
      setSelectedPlanningForApproval(null)
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi xử lý phê duyệt",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBatchStatusUpdate = async (data) => {
    if (!selectedBatchForStatusUpdate) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Tìm planning chứa batch này
      const planningIndex = mockPlannings.findIndex((p) =>
        p.batches.some((b) => b.batch_id === selectedBatchForStatusUpdate.batch_id),
      )

      if (planningIndex !== -1) {
        const batchIndex = mockPlannings[planningIndex].batches.findIndex(
          (b) => b.batch_id === selectedBatchForStatusUpdate.batch_id,
        )

        if (batchIndex !== -1) {
          mockPlannings[planningIndex].batches[batchIndex] = {
            ...mockPlannings[planningIndex].batches[batchIndex],
            status: data.status,
            batch_note: data.notes || mockPlannings[planningIndex].batches[batchIndex].batch_note,
            updated_at: new Date().toISOString(),
          }

          // Cập nhật status của planning
          mockPlannings[planningIndex].status = calculatePlanningStatus(mockPlannings[planningIndex].batches)
          mockPlannings[planningIndex].updated_at = new Date().toISOString()
        }
      }

      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: `Lô ${selectedBatchForStatusUpdate.production_batch_id} đã được cập nhật`,
        timer: 2000,
        showConfirmButton: false,
      })

      setIsStatusUpdateDialogOpen(false)
      setSelectedBatchForStatusUpdate(null)
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi cập nhật trạng thái",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openPlanningDetailsDialog = (planning) => {
    setSelectedPlanningForDetails(planning)
    setIsPlanningDetailsDialogOpen(true)
  }

  const openBatchDetailsDialog = (batch) => {
    setSelectedBatchForDetails(batch)
    setIsBatchDetailsDialogOpen(true)
  }

  const openPlanningApprovalDialog = (planning) => {
    setSelectedPlanningForApproval(planning)
    setIsPlanningApprovalDialogOpen(true)
  }

  const openBatchStatusUpdateDialog = (batch) => {
    setSelectedBatchForStatusUpdate(batch)
    setIsStatusUpdateDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Kế hoạch Sản xuất</h1>
          <p className="text-muted-foreground">Tạo và theo dõi các kế hoạch sản xuất với nhiều lô</p>
        </div>
        <Button onClick={() => setIsCreatePlanningDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo Kế hoạch Mới
        </Button>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo mã kế hoạch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="rejected">Đã hủy</SelectItem>
            <SelectItem value="in_progress">Đang sản xuất</SelectItem>
            <SelectItem value="pendingimport">Chờ nhập kho</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="fix">Cần xử lý</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PlanningTable
        plannings={filteredPlannings}
        onViewPlanningDetails={openPlanningDetailsDialog}
        onViewBatchDetails={openBatchDetailsDialog}
        onApprovePlanning={openPlanningApprovalDialog}
        onUpdateBatchStatus={openBatchStatusUpdateDialog}
        canApprovePlanning={canApprovePlanning}
        canUpdateBatchStatus={canUpdateBatchStatus}
      />

      {filteredPlannings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kế hoạch sản xuất</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tạo kế hoạch sản xuất mới</p>
        </div>
      )}

      {/* Dialogs */}
      <CreatePlanningDialog
        isOpen={isCreatePlanningDialogOpen}
        onClose={() => setIsCreatePlanningDialogOpen(false)}
        onSubmit={handleCreatePlanning}
        isSubmitting={isSubmitting}
      />

      <BatchFormDialog
        isOpen={isBatchFormDialogOpen}
        onClose={() => {
          setIsBatchFormDialogOpen(false)
          setCurrentBatchCreation({
            planning: null,
            currentBatch: 1,
            totalBatches: 0,
            createdBatches: [],
          })
        }}
        onSubmit={handleCreateBatch}
        templates={mockTemplates}
        isSubmitting={isSubmitting}
        currentBatch={currentBatchCreation.currentBatch}
        totalBatches={currentBatchCreation.totalBatches}
        planningNote={currentBatchCreation.planning?.planning_note}
      />

      <PlanningDetailsDialog
        isOpen={isPlanningDetailsDialogOpen}
        onClose={() => {
          setIsPlanningDetailsDialogOpen(false)
          setSelectedPlanningForDetails(null)
        }}
        planning={selectedPlanningForDetails}
      />

      <BatchDetailsDialog
        isOpen={isBatchDetailsDialogOpen}
        onClose={() => {
          setIsBatchDetailsDialogOpen(false)
          setSelectedBatchForDetails(null)
        }}
        batch={selectedBatchForDetails}
      />

      <PlanningApprovalDialog
        isOpen={isPlanningApprovalDialogOpen}
        onClose={() => {
          setIsPlanningApprovalDialogOpen(false)
          setSelectedPlanningForApproval(null)
        }}
        onSubmit={handlePlanningApproval}
        planning={selectedPlanningForApproval}
        isSubmitting={isSubmitting}
      />

      <StatusUpdateDialog
        isOpen={isStatusUpdateDialogOpen}
        onClose={() => {
          setIsStatusUpdateDialogOpen(false)
          setSelectedBatchForStatusUpdate(null)
        }}
        onSubmit={handleBatchStatusUpdate}
        batch={selectedBatchForStatusUpdate}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
