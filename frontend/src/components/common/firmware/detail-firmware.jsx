"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
	ArrowLeft,
	AlertTriangle,
	FileText,
	FileX,
} from "lucide-react"
import Swal from "sweetalert2"
import axiosIOTPublic from "@/apis/clients/iot.private.client"

export default function FirmwareDetailPage() {
	const [firmware, setFirmware] = useState(null)
	const params = useParams()
	const [formData, setFormData] = useState({
		firmwareId: "",
		testResult: false,
	})
	const navigate = useNavigate()

	useEffect(() => {
		const fetchFirmware = async () => {
			const response = await axiosIOTPublic.get(`firmware/detail/${params.id}`)

			if (response.success) {
				setFirmware(response.data)
				setFormData({
					firmwareId: response.data.firmware_id,
					testResult: response.data.tested_at ? true : false,
				})
			}
		}
		fetchFirmware()
	}, [params.id])

	if (!firmware) {
		return <div>Đang tải...</div>
	}

	const getStatusBadge = () => {
		if (!firmware.is_approved && !firmware.tested_at) {
			return (
				<Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
					Chờ kiểm tra
				</Badge>
			)
		}
		if (firmware.tested_at && !firmware.is_approved) {
			return <Badge variant="destructive">Không được duyệt</Badge>
		}
		if (firmware.is_approved) {
			return (
				<Badge variant="default" className="bg-green-100 text-green-800">
					Đã duyệt
				</Badge>
			)
		}
		return <Badge variant="secondary">Chưa xác định</Badge>
	}

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleString("vi-VN")
	}

	const getActionButton = () => {
		if (!firmware.tested_at) {
			return (
				<Button variant="ghost" size="sm" className="gap-1 bg-blue-500 hover:bg-blue-600 text-white hover:text-white" onClick={() => handleSubmit("confirmTest")}>
					<ArrowLeft className="h-4 w-4" />
					Xác nhận kiểm tra
				</Button>
			)
		} else if (!firmware.is_approved) {
			return (
				<Button variant="ghost" size="sm" className="gap-1 bg-green-500 hover:bg-green-600 text-white hover:text-white" onClick={() => handleSubmit("confirmApprove")}>
					<ArrowLeft className="h-4 w-4" />
					Xác nhận duyệt
				</Button>
			)
		}
	}

	const handleSubmit = async (type) => {
		console.log('type', type)
		if (type !== "confirmTest" && type !== "confirmApprove") {
			return Swal.fire({
				title: "Lỗi",
				text: "Kiểu xác nhận không hợp lệ",
				icon: "error",
				confirmButtonText: "OK",
			})
		}
		console.log('type', type)

		try {
			Swal.fire({
				title: "Xác nhận",
				text: "Bạn có chắc chắn muốn xác nhận kiểm tra?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Duyệt",
				cancelButtonText: "Hủy bỏ",
			}).then(async (result) => {
				if (result.isConfirmed) {
					console.log(type)
					console.log(type === "confirmTest")
					const pathTest = type === "confirmTest" ? "confirm-by-tester" : "confirm-by-rd"

					const response = await axiosIOTPublic.patch(`firmware/${pathTest}`, {
						firmwareId: formData.firmwareId,
						testResult: true,
					})

					console.log('response', response)

					if (response.success) {
						const result = await Swal.fire({
							title: "Thành công",
							icon: "success",
							confirmButtonText: "OK",
						})

						if (result.isConfirmed) {
							window.location.reload()
						}
					} else {
						Swal.fire({
							title: "Thất bại",
							text: response.message,
							icon: "error",
							confirmButtonText: "OK",
						})
					}
				}
			}).catch((error) => {
				Swal.fire({
					title: "Lỗi",
					text: "Có lỗi xảy ra khi xác nhận kiểm tra \n" + error,
					icon: "error",
					confirmButtonText: "OK",
				})
			})
		} catch (error) {
			Swal.fire({
				title: "Lỗi",
				text: "Có lỗi xảy ra khi xác nhận kiểm tra",
				icon: "error",
				confirmButtonText: "OK",
			})
		}
	}

	return (
		<div className="max-w-7xl mx-auto space-y-8 p-6">
			<div className="flex items-center justify-between">
				<Button variant="ghost" size="sm" asChild className="gap-1 hover:bg-gray-100">
					<Link to="/admin/manager-template">
						<ArrowLeft className="h-4 w-4" />
						Trở về
					</Link>
				</Button>
			</div>

			{/* Header thông tin */}
			<div className="grid gap-8">
				<Card className="shadow-sm border-gray-200">
					<CardHeader className="pb-4">
						<div className="flex items-start justify-between">
							<div className="space-y-1">
								<CardTitle className="text-2xl font-semibold flex items-center gap-3">
									<FileText className="h-6 w-6 text-blue-600" />
									{firmware.name}
									{getStatusBadge()}
								</CardTitle>
								<CardDescription className="text-base">
									{firmware.template_name} • Tạo ngày {formatDate(firmware.created_at)}
								</CardDescription>
							</div>
							<div className="text-right space-y-2">
								{firmware.is_mandatory && (
									<Badge variant="destructive" className="mb-2 px-3 py-1">
										<AlertTriangle className="h-3 w-3 mr-1" />
										Bắt buộc
									</Badge>
								)}
							</div>
							{getActionButton()}
						</div>
					</CardHeader>
				</Card>

				{/* Nội dung chi tiết */}
				<div className="grid grid-cols-2 gap-6">
					<Card className="shadow-sm border-gray-200">
						<CardHeader>
							<CardTitle className="text-xl font-semibold">Thông tin chi tiết</CardTitle>
						</CardHeader>
						<CardContent className="">
							<div className="grid">
								<div className="flex justify-between items-center p-1 bg-gray-50 rounded-lg">
									<span className="text-sl font-medium text-gray-600">Phiên bản:</span>
									<span className="text-sl font-semibold">{firmware.version}</span>
								</div>
								<div className="flex justify-between items-center p-1 bg-gray-50 rounded-lg">
									<span className="text-sl font-medium text-gray-600">Template:</span>
									<span className="text-sl font-semibold">{firmware.template_name}</span>
								</div>
								<div className="flex justify-between items-center p-1 bg-gray-50 rounded-lg">
									<span className="text-sl font-medium text-gray-600">Đường dẫn file:</span>
									<code className="text-sl bg-gray-100 px-3 py-1.5 rounded-md font-mono">{firmware.file_path}</code>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="shadow-sm border-gray-200">
						<CardHeader>
							<CardTitle className="text-xl font-semibold">Ghi chú</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-600 leading-relaxed">{firmware.note}</p>
						</CardContent>
					</Card>
				</div>
				<Card className="mt-6 shadow-md border-gray-200 rounded-xl overflow-hidden">
					<CardHeader className="bg-gray-100 border-b border-gray-200">
						<CardTitle className="text-2xl font-semibold text-gray-800">
							Lịch sử thao tác (Logs)
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						{firmware.logs && firmware.logs.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="min-w-full text-sm text-gray-700">
									<thead>
										<tr className="bg-gray-50 text-gray-800 uppercase text-xs font-medium">
											<th className="px-4 py-3 text-left">Hành động</th>
											<th className="px-4 py-3 text-left">Thời gian</th>
											<th className="px-4 py-3 text-left">Nhân viên</th>
											<th className="px-4 py-3 text-left">Nội dung</th>
										</tr>
									</thead>
									<tbody>
										{firmware.logs.map((log, idx) => (
											<tr
												key={idx}
												className={`border-b transition-opacity duration-300 ease-in-out hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-25"
													}`}
											>
												<td className="px-4 py-3">
													<Badge
														className={`px-2 py-1 text-xs font-medium rounded-full cursor-default transition-colors duration-200
															${log.log_type === "create"
																? "bg-blue-600 text-white hover:bg-blue-700"
																: log.log_type === "update"
																	? "bg-green-600 text-white hover:bg-green-700"
																	: log.log_type === "delete"
																		? "bg-red-600 text-white hover:bg-red-700"
																		: log.log_type === "tester_confirm"
																			? "bg-cyan-600 text-white hover:bg-cyan-700"
																			: log.log_type === "rd_confirm"
																				? "bg-teal-600 text-white hover:bg-teal-700"
																				: log.log_type === "rd_reject" || log.log_type === "test_failed"
																					? "bg-red-500 text-white hover:bg-red-600"
																					: "bg-gray-600 text-white hover:bg-gray-700"
															}
														`}
														title={`Hành động: ${log.log_type}`} // Tooltip for accessibility
													>
														{log.log_type === "create" ? "Tạo" : log.log_type === "update" ? "Cập nhật" : log.log_type === "delete" ? "Xóa" : log.log_type === "tester_confirm" ? "Xác nhận kiểm tra" : log.log_type === "rd_confirm" ? "Xác nhận duyệt" : log.log_type === "rd_reject" ? "Từ chối duyệt" : log.log_type === "test_failed" ? "Kiểm tra thất bại" : "Không xác định"}
													</Badge>
												</td>
												<td className="px-4 py-3 whitespace-nowrap">
													{new Date(log.created_at).toLocaleString("vi-VN", {
														year: "numeric",
														month: "2-digit",
														day: "2-digit",
														hour: "2-digit",
														minute: "2-digit",
														second: "2-digit",
													})}
												</td>
												<td className="px-4 py-3">{log.employee || "N/A"}</td>
												<td className="px-4 py-3">{log.log_message || "Không có nội dung"}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-8 text-gray-500">
								<FileX className="w-12 h-12 mb-2 opacity-50" />
								<p className="text-base">Chưa có lịch sử thao tác.</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
