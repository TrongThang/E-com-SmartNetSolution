import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, AlertTriangle, FileText, Calendar } from "lucide-react"

export default function EditFirmwarePage() {
    const params = useParams()
    const navigate = useNavigate()
    const [firmware, setFirmware] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const deviceTemplates = [
        { template_id: 1, name: "Camera Xiaomi 360°" },
        { template_id: 2, name: "Đèn thông minh Philips" },
        { template_id: 3, name: "Cảm biến nhiệt độ" },
    ]

    useEffect(() => {
        // Giả lập fetch dữ liệu từ API
        const mockData = {
            firmware_id: Number.parseInt(params.id),
            version: "v2.1.0",
            template_id: 1,
            template_name: "Camera Xiaomi 360°",
            is_mandatory: true,
            note: "Cập nhật tính năng phát hiện chuyển động và sửa lỗi kết nối WiFi",
            file_path: "/firmware/camera_v2.1.0.bin",
            file_size: "2.5 MB",
            created_at: "2024-01-15T10:30:00Z",
            is_approved: true,
        }
        setFirmware(mockData)
    }, [params.id])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFirmware((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("Updated firmware:", firmware)
        setIsLoading(false)
        navigate("/admin/firmware")
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("vi-VN")
    }

    if (!firmware) {
        return <div>Đang tải...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/firmware/${params.id}`}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Trở về
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Chỉnh sửa Firmware</h1>
                        <p className="text-muted-foreground">Cập nhật thông tin firmware {firmware.version}</p>
                    </div>
                </div>
                <Badge variant={firmware.is_approved ? "default" : "secondary"} className="bg-green-100 text-green-800">
                    {firmware.is_approved ? "Đã duyệt" : "Chờ duyệt"}
                </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Thông tin Firmware
                            </CardTitle>
                            <CardDescription>Chỉnh sửa thông tin chi tiết của firmware</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="version">Phiên bản *</Label>
                                        <Input
                                            id="version"
                                            name="version"
                                            value={firmware.version}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="template_id">Device Template *</Label>
                                        <Select
                                            value={firmware.template_id.toString()}
                                            onValueChange={(value) =>
                                                setFirmware((prev) => ({ ...prev, template_id: Number.parseInt(value) }))
                                            }
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {deviceTemplates.map((template) => (
                                                    <SelectItem key={template.template_id} value={template.template_id.toString()}>
                                                        {template.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_mandatory"
                                        checked={firmware.is_mandatory}
                                        onCheckedChange={(checked) =>
                                            setFirmware((prev) => ({ ...prev, is_mandatory: checked }))
                                        }
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="is_mandatory" className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        Cập nhật bắt buộc
                                    </Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="note">Ghi chú</Label>
                                    <Textarea
                                        id="note"
                                        name="note"
                                        value={firmware.note}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        rows={4}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate(`/admin/firmware/${params.id}`)}
                                        disabled={isLoading}
                                    >
                                        Hủy
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            "Đang lưu..."
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Lưu thay đổi
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin File</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Đường dẫn file</p>
                                <code className="text-xs bg-muted px-2 py-1 rounded">{firmware.file_path}</code>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Kích thước</p>
                                <p className="font-medium">{firmware.file_size}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                                <p className="font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(firmware.created_at)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-orange-50">
                        <CardHeader>
                            <CardTitle className="text-orange-700 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Lưu ý
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-1 text-sm text-orange-700">
                                <li>• Không thể thay đổi file firmware</li>
                                <li>• Thay đổi sẽ ảnh hưởng đến tất cả thiết bị</li>
                                <li>• Cần duyệt lại nếu thay đổi quan trọng</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
