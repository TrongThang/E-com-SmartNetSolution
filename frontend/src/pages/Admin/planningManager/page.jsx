"use client"

import { useState, useEffect } from "react"
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
import PlanPagination from "@/components/common/planning/PlanPagination"

// Import API services
import PlanningApi from "@/apis/modules/planning.api.ts"

// Mock current user - Sẽ được thay thế bằng hệ thống xác thực thực tế
const currentUser = {
  id: "user001",
  name: "Nguyễn Văn A",
  role: "manager",
}

const PAGE_SIZE = 6;

export default function ProductionPlanningManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [plannings, setPlannings] = useState([])
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true)

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

  // Thêm state để lưu tạm thời dữ liệu
  const [tempBatches, setTempBatches] = useState([]);
  const [tempPlanning, setTempPlanning] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  // Fetch data on component mount
  useEffect(() => {
    console.log("Component mount, gọi fetchPlannings");
    fetchPlannings();
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ gọi 1 lần khi mount

  const fetchPlannings = async () => {
    try {
      setLoading(true)
      const response = await PlanningApi.getAll()
      if (response.success && response.data) {
        const planningsData = Array.isArray(response.data) ? response.data : [response.data]
        const processedPlannings = planningsData.map(planning => ({
          ...planning,
          batches: planning.batches || planning.production_batches || []
        }))
        setPlannings(processedPlannings)
      } else {
        console.error("Failed to fetch plannings:", response.error)
        setPlannings([])
      }
    } catch (error) {
      console.error("Error fetching plannings:", error)
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể tải danh sách kế hoạch",
      })
      setPlannings([])
    } finally {
      setLoading(false)
    }
  }

  // Tính toán filteredPlannings cho trang hiện tại
  const filteredPlannings = plannings.filter((planning) => {
    const matchesSearch =
      planning.planning_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planning.planning_note?.toLowerCase().includes(searchTerm.toLowerCase());

    // Thay đổi logic lọc status
    const matchesStatus =
      statusFilter === "rejected"
        ? planning.status.toLowerCase() === "rejected"
        : statusFilter === "all"
          ? planning.status.toLowerCase() !== "rejected" // Ẩn các kế hoạch bị hủy khi xem tất cả
          : planning.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setTotalPage(Math.ceil(filteredPlannings.length / PAGE_SIZE) || 1);
    if (page > Math.ceil(filteredPlannings.length / PAGE_SIZE)) setPage(1);
  }, [filteredPlannings.length]);

  const currentPlannings = filteredPlannings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage);
    }
  };

  // Permission functions
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
    setIsSubmitting(true);
    try {
      const planningData = {
        planning_note: data.planning_note,
        batch_count: data.batch_count,
      };

      setTempPlanning(planningData);
      setTempBatches([]);

      setCurrentBatchCreation({
        planning: planningData,
        currentBatch: 1,
        totalBatches: data.batch_count,
        createdBatches: [],
      });

      setIsCreatePlanningDialogOpen(false);
      setIsBatchFormDialogOpen(true);
    } catch (error) {
      console.error("Lỗi khi tạo kế hoạch:", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: error.message || "Có lỗi xảy ra khi tạo kế hoạch",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateBatch = async (data) => {
    setIsSubmitting(true);
    try {
      // Validate dữ liệu đầu vào cơ bản
      if (!data.template_id || !data.quantity) {
        throw new Error("Vui lòng điền đầy đủ thông tin Template ID và Số lượng");
      }

      if (isNaN(data.quantity) || data.quantity <= 0) {
        throw new Error("Số lượng phải là số dương");
      }

      const batchData = {
        template_id: Number(data.template_id),
        quantity: Number(data.quantity),
        batch_note: data.batch_note || "",
        firmware_id: data.firmware_id !== "none" && data.firmware_id ? Number(data.firmware_id) : null,
      };

      const updatedTempBatches = [...tempBatches, batchData];
      setTempBatches(updatedTempBatches);

      if (currentBatchCreation.currentBatch === currentBatchCreation.totalBatches) {
        try {
          // Tạo planning và batches trong một lần gọi API
          const response = await PlanningApi.createWithBatches({
            planning: {
              planning_note: tempPlanning.planning_note,
              batch_count: updatedTempBatches.length,
            },
            batches: updatedTempBatches
          });

          if (!response.success) {
            throw new Error(response.error || "Không thể tạo kế hoạch và lô");
          }

          // Đóng dialog trước
          setIsBatchFormDialogOpen(false);

          // Sau đó mới hiển thị Swal
          await Swal.fire({
            icon: "success",
            title: "🎉 Tạo kế hoạch thành công!",
            html: `
                <div class="text-left">
                    <p><strong>Mã kế hoạch:</strong> ${response.data.planning_id}</p>
                    <p><strong>Số lô đã tạo:</strong> ${updatedTempBatches.length}</p>
                </div>
            `,
            confirmButtonText: "OK",
            confirmButtonColor: "#22c55e",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });

          // Cuối cùng mới reset state và fetch lại data
          handleCancel();
          fetchPlannings();

        } catch (error) {
          console.error("Lỗi:", error);
          // Đóng dialog trước khi hiển thị Swal
          setIsBatchFormDialogOpen(false);

          await Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Có lỗi xảy ra khi tạo kế hoạch và lô",
            confirmButtonText: "OK",
            confirmButtonColor: "#ef4444",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          handleCancel();
        }
      } else {
        // Chuyển sang lô tiếp theo
        setCurrentBatchCreation({
          ...currentBatchCreation,
          currentBatch: currentBatchCreation.currentBatch + 1,
          createdBatches: updatedTempBatches,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo lô:", error);
      // Đóng dialog trước khi hiển thị Swal
      setIsBatchFormDialogOpen(false);

      await Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi tạo lô",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      handleCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTempBatches([]);
    setTempPlanning(null);
    setCurrentBatchCreation({
      planning: null,
      currentBatch: 1,
      totalBatches: 0,
      createdBatches: [],
    });
    setIsBatchFormDialogOpen(false);
  };
  const fetchPlanningDetails = async (planningId) => {
    try {
      const response = await PlanningApi.getById(planningId)

      if (response.success && response.data) {
        const planningData = response.data

        // Đảm bảo có trường production_batches
        const planningWithBatches = {
          ...planningData,
          production_batches: planningData.production_batches || []
        }

        setSelectedPlanningForDetails(planningWithBatches)
        setIsPlanningDetailsDialogOpen(true)
      }
    } catch (error) {
      console.error("Error fetching planning details:", error)
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể tải chi tiết kế hoạch",
      })
    }
  }

  const handlePlanningApproval = async (data) => {
    if (!selectedPlanningForApproval) return;
    setIsSubmitting(true);
    try {
      // Gửi đúng format cho API
      const approvalData = {
        status: data.status, // đã được chuyển thành 'approved' hoặc 'rejected' từ dialog
        notes: data.notes,
      };
      const response = await PlanningApi.approve(selectedPlanningForApproval.planning_id, approvalData);
      if (response.success) {
        setIsPlanningApprovalDialogOpen(false);
        setSelectedPlanningForApproval(null);
        await Swal.fire({
          icon: data.status === "approved" ? "success" : "warning",
          title: data.status === "approved" ? "Phê duyệt thành công!" : "Đã từ chối!",
          text: `Kế hoạch ${selectedPlanningForApproval.planning_id} đã được ${data.status === "approved" ? "phê duyệt và bắt đầu sản xuất" : "từ chối và hủy tất cả lô"}`,
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
        fetchPlannings();
      } else {
        throw new Error(response.error || "Không thể phê duyệt kế hoạch");
      }
    } catch (error) {
      console.error("Error approving planning:", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: error.response?.data?.message || error.message || "Có lỗi xảy ra khi xử lý phê duyệt",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleBatchStatusUpdate = async (data) => {
    if (!selectedBatchForStatusUpdate) return;
    setIsSubmitting(true);
    try {
      const updateData = {
        status: data.status,
        batch_note: data.notes || selectedBatchForStatusUpdate.batch_note,
      };
      const response = await PlanningApi.updateBatchStatus(selectedBatchForStatusUpdate.production_batch_id, updateData);
      if (response.success) {
        setIsStatusUpdateDialogOpen(false);
        setSelectedBatchForStatusUpdate(null);
        setIsBatchDetailsDialogOpen(false);
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Lô đã được cập nhật.",
            showConfirmButton: true,
            confirmButtonText: "OK",
          });
        }, 100);
        fetchPlannings();
      } else {
        throw new Error(response.error || "Không thể cập nhật trạng thái lô");
      }
    } catch (error) {
      console.error("Error updating batch status:", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: error.response?.data?.message || error.message || "Có lỗi xảy ra khi cập nhật trạng thái",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  const fetchTemplates = async () => {
    try {
      const response = await PlanningApi.getAllDeviceTemplates();
      console.log("API trả về:", response);
      if (Array.isArray(response)) {
        setTemplates(response);
        console.log("Templates sau khi set:", response);
      } else {
        setTemplates([]);
      }
    } catch (error) {
      setTemplates([]);
    }
  };

  const openPlanningDetailsDialog = async (planning) => {
    try {
      await fetchPlanningDetails(planning.planning_id)
    } catch (error) {
      console.error("Error opening planning details:", error)
    }
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
        <Button onClick={() => {
          if (templates.length === 0) {
            Swal.fire({
              icon: "warning",
              title: "Không có template khả dụng",
              text: "Hiện không có template nào đủ điều kiện để tạo kế hoạch",
            });
            return;
          }
          setIsCreatePlanningDialogOpen(true);
        }}>
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
        <Button
          variant={statusFilter === "rejected" ? "destructive" : "outline"}
          onClick={() => setStatusFilter(statusFilter === "rejected" ? "all" : "rejected")}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
          {statusFilter === "rejected" ? "Tất cả kế hoạch" : "Xem kế hoạch bị hủy"}
        </Button>
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

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900">Đang tải dữ liệu...</h3>
        </div>
      ) : (
        <>
          <PlanningTable
            plannings={currentPlannings}
            onViewPlanningDetails={openPlanningDetailsDialog}
            onViewBatchDetails={openBatchDetailsDialog}
            onApprovePlanning={openPlanningApprovalDialog}
            onUpdateBatchStatus={openBatchStatusUpdateDialog}
            canApprovePlanning={canApprovePlanning}
            canUpdateBatchStatus={canUpdateBatchStatus}
          />
          <PlanPagination page={page} totalPage={totalPage} onPageChange={handlePageChange} />
        </>
      )}

      {!loading && filteredPlannings.length === 0 && (
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
        onClose={handleCancel}
        onSubmit={handleCreateBatch}
        templates={templates}
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