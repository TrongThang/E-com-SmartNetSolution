import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, AlertTriangle, Info, Shield, Clock, Users, Loader2, CheckCircle } from "lucide-react"
import Swal from "sweetalert2"
import axiosIOTPublic from "@/apis/clients/iot.public.client"

export default function EditFirmwarePage() {
    const params = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        version: "",
        name: "",
        id: "",
        is_mandatory: false,
        note: "",
    })
    const [error, setError] = useState({
        version: "",
        name: "",
        id: "",
        is_mandatory: "",
        note: "",
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [saveProgress, setSaveProgress] = useState(0)
    const [deviceTemplates, setDeviceTemplates] = useState([])
    const [selectedTemplate, setSelectedTemplate] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch firmware details
                const firmwareResponse = await axiosIOTPublic.get(`firmware/detail/${params.id}`)
                if (firmwareResponse.success) {
                    const firmwareData = firmwareResponse.data
                    console.log('firmwareData:',firmwareData)
                    setFormData({
                        version: firmwareData.version,
                        name: firmwareData.name,
                        id: firmwareData.template_id,
                        is_mandatory: firmwareData.is_mandatory,
                        note: firmwareData.note,
                    })
                    setSelectedTemplate(firmwareData.template)
                }

                // Fetch device templates
                const templatesResponse = await axiosIOTPublic.get("firmware/latest-version-by-template")
                if (templatesResponse.success) {
                    setDeviceTemplates(templatesResponse.data)
                }
            } catch (error) {
                Swal.fire({
                    title: "Lỗi",
                    text: "Không thể tải thông tin firmware",
                    icon: "error",
                })
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [params.id])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        setSaveProgress(0)

        // Validate form
        if (!formData.version.trim()) {
            setError({ ...error, version: "Vui lòng nhập phiên bản!" })
            setIsSaving(false)
            return
        }

        if (!formData.id) {
            setError({ ...error, template_id: "Vui lòng chọn device template!" })
            setIsSaving(false)
            return
        }

        // Simulate progress
        const progressInterval = setInterval(() => {
            setSaveProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval)
                    return prev
                }
                return prev + 10
            })
        }, 200)

        try {
            const updatedFirmware = {
                name: formData.name,
                version: formData.version,
                template_id: formData.id,
                is_mandatory: formData.is_mandatory,
                note: formData.note,
            }

            const response = await axiosIOTPublic.put(`firmware/edit/${params.id}`, updatedFirmware)

            if (response.success) {
                setSaveProgress(100)
                clearInterval(progressInterval)
                
                const result = await Swal.fire({
                    title: "Thành công",
                    text: "Firmware đã được cập nhật thành công",
                    icon: "success",
                })

                if (result.isConfirmed) {
                    navigate("/admin/templates?tab=firmwares")
                }
            } else {
                Swal.fire({
                    title: "Lỗi",
                    text: response.message,
                    icon: "error",
                })
            }
        } catch (error) {
            clearInterval(progressInterval)
            Swal.fire({
                title: "Lỗi",
                text: "Có lỗi xảy ra trong quá trình cập nhật",
                icon: "error",
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[600px] flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/templates?tab=firmwares">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Trở về
                    </Link>
                </Button>
                <Badge variant={selectedTemplate?.is_approved ? "default" : "secondary"} className="bg-green-100 text-green-800">
                    {selectedTemplate?.is_approved ? "Đã duyệt" : "Chờ duyệt"}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Thông tin Firmware
                            </CardTitle>
                            <CardDescription>Chỉnh sửa thông tin chi tiết về phiên bản firmware</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-base font-medium">
                                        Tên firmware *
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Firmware 1.0.0"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={isSaving}
                                        className="h-12"
                                    />
                                    {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="version" className="text-base font-medium">
                                            Phiên bản *
                                        </Label>
                                        <Input
                                            id="version"
                                            name="version"
                                            placeholder="1.0.0"
                                            value={formData.version}
                                            onChange={handleInputChange}
                                            disabled={isSaving}
                                            className="h-12"
                                        />
                                        {error.version && <p className="text-red-500 text-sm">{error.version}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="template_id" className="text-base font-medium">
                                            Device Template *
                                        </Label>
                                        <Select
                                            value={formData.id}
                                            onValueChange={(value) => {
                                                const selectedTemplate = deviceTemplates.find((t) => t.id === value)
                                                if (selectedTemplate) {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        id: value,
                                                    }))
                                                    setSelectedTemplate(selectedTemplate)
                                                }
                                            }}
                                            disabled={isSaving}
                                        >
                                            <SelectTrigger className="h-12">
                                                <SelectValue placeholder="Chọn loại thiết bị" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {deviceTemplates.map((template) => (
                                                    <SelectItem key={template.id} value={template.id}>
                                                        <div className="flex items-center justify-between w-full">
                                                            <span>{template.template_name}</span>
                                                            <Badge variant="secondary" className="ml-2 bg-blue-500">
                                                                {template.total_devices} thiết bị
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {error.template_id && <p className="text-red-500 text-sm">{error.template_id}</p>}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="is_mandatory"
                                            checked={formData.is_mandatory}
                                            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_mandatory: checked }))}
                                            disabled={isSaving}
                                        />
                                        <Label
                                            htmlFor="is_mandatory"
                                            className="flex items-center gap-2 cursor-pointer text-base font-medium"
                                        >
                                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                                            Phiên bản firmware bắt buộc
                                        </Label>
                                    </div>
                                    {formData.is_mandatory ? (
                                        <div className="ml-8 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                            <p className="text-sm text-orange-700">
                                                ⚠️ Tất cả thiết bị {formData.name} chỉ sử dụng phiên bản này
                                            </p>
                                        </div>
                                    ) : <></>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="note" className="text-base font-medium">
                                        Ghi chú phiên bản
                                    </Label>
                                    <Textarea
                                        id="note"
                                        name="note"
                                        placeholder="Mô tả những thay đổi, cải tiến, sửa lỗi trong phiên bản này..."
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        disabled={isSaving}
                                        rows={4}
                                        className="resize-none"
                                    />
                                    {error.note && <p className="text-red-500 text-sm">{error.note}</p>}
                                </div>

                                {isSaving && (
                                    <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Đang cập nhật firmware...
                                            </span>
                                            <span className="text-sm font-mono">{saveProgress}%</span>
                                        </div>
                                        <Progress value={saveProgress} className="w-full h-2" />
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Info className="h-4 w-4" />
                                            <p>Vui lòng không đóng trang trong quá trình cập nhật</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-4 pt-6 border-t">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate("/admin/templates?tab=firmwares")}
                                        className="min-w-[160px]"
                                        disabled={isSaving}
                                        size="lg"
                                    >
                                        Hủy bỏ
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSaving || !formData.version || !formData.id}
                                        size="lg"
                                        className="min-w-[160px]"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang lưu...
                                            </>
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
                    {selectedTemplate && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Template đã chọn
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">{selectedTemplate.template_name}</h4>
                                    <p className="text-sm text-muted-foreground">Template ID: {selectedTemplate.id}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Thiết bị</p>
                                        <p className="font-semibold flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {selectedTemplate.template_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phiên bản hiện tại</p>
                                        <Badge variant="outline">{selectedTemplate?.lastest_version}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Hướng dẫn Cập nhật
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2 text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    Phiên bản
                                </h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Phiên bản phải được đặt theo đúng định dạng: 1.0.0</li>
                                    <li>• Phiên bản phải là phiên bản mới nhất {selectedTemplate?.lastest_version ?? ""}</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-blue-600 flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Quy trình duyệt
                                </h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Cập nhật → Kiểm tra tự động</li>
                                    <li>• Tester duyệt → Kiểm tra thành công</li>
                                    <li>• Bộ phận R&D duyệt → Sẵn sàng triển khai</li>
                                    <li>• Firmware bắt buộc tự động cập nhật</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-orange-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-700">
                                <AlertTriangle className="h-5 w-5" />
                                Lưu ý bảo mật
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-orange-700">
                                <li>• Chỉ cập nhật firmware từ nguồn tin cậy</li>
                                <li>• Kiểm tra kỹ trước khi đánh dấu bắt buộc</li>
                                <li>• Backup firmware cũ trước khi triển khai</li>
                                <li>• Thay đổi sẽ ảnh hưởng đến tất cả thiết bị</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}