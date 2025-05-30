"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Eye, ChevronDown, ChevronRight, Package, User, Settings } from "lucide-react"
import {
  getPlanningStatusColor,
  getPlanningStatusLabel,
  getPlanningStatusIcon,
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
} from "@/components/common/planning/planningStatusUtils"

export function PlanningTable({
  plannings,
  onViewPlanningDetails,
  onViewBatchDetails,
  onApprovePlanning,
  onUpdateBatchStatus,
  canApprovePlanning,
  canUpdateBatchStatus,
}) {
  const [expandedPlannings, setExpandedPlannings] = useState(new Set())

  const togglePlanning = (planningId) => {
    const newExpanded = new Set(expandedPlannings)
    if (newExpanded.has(planningId)) {
      newExpanded.delete(planningId)
    } else {
      newExpanded.add(planningId)
    }
    setExpandedPlannings(newExpanded)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Danh sách kế hoạch sản xuất</h3>
        <div className="text-sm text-gray-500">Tổng: {plannings.length} kế hoạch</div>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Kế hoạch</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Số lô</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng SL</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Người tạo</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {plannings.map((planning) => {
              const totalQuantity = planning.batches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0

              return (
                <>
                  <TableRow key={planning.planning_id} className="hover:bg-gray-50">
                    <TableCell>
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => togglePlanning(planning.planning_id)}>
                            {expandedPlannings.has(planning.planning_id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{planning.planning_id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-900">{planning.batches?.length || 0} lô</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {totalQuantity} sản phẩm
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlanningStatusColor(planning.status)}>
                        {getPlanningStatusIcon(planning.status)}
                        <span className="ml-1">{getPlanningStatusLabel(planning.status)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">{planning.created_by}</TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {new Date(planning.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewPlanningDetails(planning)}
                          className="hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {canApprovePlanning(planning) && (
                          <Button
                            size="sm"
                            onClick={() => onApprovePlanning(planning)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <User className="w-4 h-4 mr-1" />
                            Duyệt Kế Hoạch
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedPlannings.has(planning.planning_id) && (
                    <TableRow>
                      <TableCell colSpan={8} className="p-0">
                        <Collapsible open={expandedPlannings.has(planning.planning_id)}>
                          <CollapsibleContent>
                            <div className="bg-gray-50 p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-900">
                                <Package className="w-4 h-4" />
                                Danh sách lô sản xuất
                              </h4>
                              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-gray-50">
                                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã Lô
                                      </TableHead>
                                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Template
                                      </TableHead>
                                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng
                                      </TableHead>
                                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                      </TableHead>
                                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày tạo
                                      </TableHead>
                                      <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody className="bg-white divide-y divide-gray-200">
                                    {planning.production_batches?.map((batch) => (
                                      <TableRow key={batch.production_batch_id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-gray-900">
                                          {batch.production_batch_id}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-900">
                                          <div className="flex flex-col">
                                            <span>{batch.device_templates?.name || batch.template_id}</span>
                                            {batch.firmware_name && (
                                              <span className="text-xs text-gray-500">
                                                Firmware: {batch.firmware_name} (v{batch.firmware_version})
                                              </span>
                                            )}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {batch.quantity}
                                          </span>
                                        </TableCell>
                                        <TableCell>
                                          <Badge className={getStatusColor(batch.status)}>
                                            {getStatusIcon(batch.status)}
                                            <span className="ml-1">{getStatusLabel(batch.status)}</span>
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-900">
                                          {new Date(batch.created_at).toLocaleDateString("vi-VN")}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex gap-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => onViewBatchDetails(batch)}
                                              className="hover:bg-gray-50"
                                            >
                                              <Eye className="w-4 h-4" />
                                            </Button>
                                            {canUpdateBatchStatus(batch) && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onUpdateBatchStatus(batch)}
                                                className="hover:bg-gray-50"
                                              >
                                                <Settings className="w-4 h-4" />
                                              </Button>
                                            )}
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    )) || (
                                      <TableRow>
                                        <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                                          Chưa có lô nào trong kế hoạch này
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
