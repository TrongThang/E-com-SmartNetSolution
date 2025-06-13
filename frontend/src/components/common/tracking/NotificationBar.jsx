"use client"
import { useState, useEffect, useCallback } from "react"
import { Bell, ChevronDown, ChevronUp, X, Clock, CheckCircle, AlertTriangle, Package, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useManufacturing } from "@/hooks/useManufacturing"
import moment from "moment"
import 'moment/locale/vi'

export default function NotificationBar({
  onClearNotification,
  onClearAll,
  onMarkAsRead,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { notifications, setNotifications } = useManufacturing()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setUnreadCount(notifications?.filter((n) => !n.read).length)
  }, [notifications])

   // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Hàm format thời gian tương đối
  const formatRelativeTime = useCallback((timestamp) => {
    if (!timestamp) return ''
    
    const diffSeconds = Math.floor((currentTime - new Date(timestamp)) / 1000)
    
    if (diffSeconds < 60) {
      return 'Vừa xong'
    }
    
    return moment(timestamp).fromNow()
  }, [currentTime])

  const handleClearNotification = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== notificationId)
    )
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const getStageLabel = (stage) => {
    const stageLabels = {
      assembly: "Lắp ráp",
      firmware: "Firmware",
      qc: "Kiểm thử",
      completed: "Hoàn thành",
    }
    return stageLabels[stage] || stage
  }

  const getStatusConfig = (status) => {
    const configs = {
      in_progress: {
        label: "Đang xử lý",
        icon: Clock,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      firmware_upload: {
        label: "Chờ nạp firmware",
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      },
      firmware_uploading: {
        label: "Đang nạp firmware",
        icon: Zap,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      },
      firmware_uploaded: {
        label: "Đã nạp firmware",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      testing: {
        label: "Đang kiểm thử",
        icon: Package,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
      pending_packaging: {
        label: "Chờ đóng gói",
        icon: Package,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      firmware_failed: {
        label: "Lỗi firmware",
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
      fixing_label: {
        label: "Sửa nhãn",
        icon: AlertTriangle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      },
      fixing_product: {
        label: "Sửa sản phẩm",
        icon: AlertTriangle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      },
      fixing_all: {
        label: "Sửa tất cả",
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
    }

    return (
      configs[status] || {
        label: status,
        icon: Clock,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
    )
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatLogTime = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getNotificationMessage = (notification) => {
    const stage = getStageLabel(notification.stage)
    const statusConfig = getStatusConfig(notification.status)
    const stageLogs = notification.stage_logs || []
    const latestLog = stageLogs.length > 0 ? stageLogs[stageLogs.length - 1] : null

    if (notification.completed_at) {
      return `${stage}: Hoàn thành ${statusConfig.label.toLowerCase()}`
    } else if (latestLog) {
      return `${stage}: ${latestLog.message || statusConfig.label.toLowerCase()}`
    } else {
      return `${stage}: Bắt đầu ${statusConfig.label.toLowerCase()}`
    }
  }

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardContent className="p-0">
        {/* Header - Always visible */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-blue-600" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Thông báo</h3>
              <p className="text-sm text-gray-600">
                {notifications?.length > 0
                  ? `${notifications.length} thông báo${unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ""}`
                  : "Không có thông báo mới"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications?.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onClearAll()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Xóa tất cả
              </Button>
            )}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="border-t">
            {notifications?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có thông báo nào</p>
                <p className="text-sm mt-1">Thông báo sẽ xuất hiện khi có cập nhật từ hệ thống</p>
              </div>
            ) : (
              <ScrollArea className="max-h-80">
                <div className="p-4 space-y-3">
                  {notifications?.map((notification) => {
                    const statusConfig = getStatusConfig(notification.status)
                    const StatusIcon = statusConfig.icon

                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                          statusConfig.bgColor,
                          statusConfig.borderColor,
                          !notification.read && "ring-2 ring-blue-200",
                        )}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div
                          className={cn("p-1.5 rounded-full", statusConfig.bgColor)}
                        >
                          <StatusIcon className={cn("w-4 h-4", statusConfig.color)} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="w-full">
                              <p className={cn(
                                "text-sm font-medium",
                                !notification.read ? "text-gray-900" : "text-gray-600"
                              )}>
                                {getNotificationMessage(notification)}
                              </p>

                              {notification.serial && (
                                <p className="text-xs text-gray-600 mt-1">
                                  Serial: <span className="font-mono">{notification.serial}</span>
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col items-end justify-start ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleClearNotification(notification.id)
                                }}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                              <span className="text-xs text-gray-400 mt-1 whitespace-nowrap">
                                {formatRelativeTime(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}