import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, FileText, AlertTriangle, CheckCircle, X, Info, Shield, Clock, Users, Loader2 } from "lucide-react"
import Swal from "sweetalert2"
import axiosIOTPublic from "@/apis/clients/iot.private.client"

export default function NewFirmwarePage() {
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
        id: "",
        is_mandatory: "",
        note: "",
        file: "",
        name: "",
    })

    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [deviceTemplates, setDeviceTemplates] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [textFile, setTextFile] = useState('') //Dùng để đưa nội dung file

    // Dữ liệu mẫu cho device templates
    useEffect(() => {
        const fetchDeviceTemplates = async () => {
            try {
            const response = await axiosIOTPublic.get("firmware/latest-version-by-template")

                if (response.success) {
                    setDeviceTemplates(response.data)
                }
            } catch (error) {
                setIsLoading(false)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDeviceTemplates()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        console.log('e.target:',e.target.files[0])
        if (file) {
            const allowedTypes = [".ino", ".cpp", ".txt"]
            const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`

            if (!allowedTypes.includes(fileExtension)) {
                setError({ ...error, file: "Vui lòng chọn file có định dạng .ino, .cpp, .txt" })
                return
            }

            if (file.size > 10 * 1024 * 1024) {
                setError({ ...error, file: "File không được vượt quá 10MB" })
                return
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                setTextFile(e.target.result);
            };

            reader.readAsText(file);

            setSelectedFile(file)
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        setUploadProgress(0)
        setUploadComplete(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedFile) {
            setError({ ...error, file: "Vui lòng chọn file firmware!" })
            return
        }

        if (!formData.version.trim()) {
            setError({ ...error, version: "Vui lòng nhập phiên bản!" })
            return
        }

        if (!formData.id) {
            setError({ ...error, template_id: "Vui lòng chọn device template!" })
            return
        }

        const newFirmware = {
            name: formData.name,
            version: formData.version,
            template_id: formData.id,
            is_mandatory: formData.is_mandatory,
            note: formData.note,
            file_path: textFile,
        }
        try {
            console.log("newFirmware:", newFirmware)
            const response = await axiosIOTPublic.post("firmware", newFirmware)
            console.log("response:", response)
            if (response.success) {
                const result = await Swal.fire({
                    title: "Thành công",
                    text: "Firmware đã được upload thành công",
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
            Swal.fire({
                title: "Lỗi",
                text: error,
                icon: "error",
            })
        }
        

    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const selectedTemplate = deviceTemplates.find((t) => t.id === formData.id)

    if (isLoading) {
        return (
            <div className="min-h-[600px] flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        )
    }

    if (uploadComplete) {
        return (
            <div className="min-h-[600px] flex items-center justify-center">
                <Card className="w-full max-w-lg">
                    <CardContent className="pt-8 pb-8">
                        <div className="text-center space-y-6">
                            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-green-600">Upload thành công!</h3>
                                <p className="text-muted-foreground">
                                    Firmware <span className="font-semibold">{formData.version}</span> đã được upload thành công
                                </p>
                                <p className="text-sm text-muted-foreground">Hệ thống đang tiến hành kiểm tra tự động...</p>
                            </div>
                            <div className="space-y-3">
                                <Button onClick={() => navigate("/admin/templates?tab=firmwares")} className="w-full" size="lg">
                                    Quay về danh sách Firmware
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/admin/firmware/${formData.id}`)}
                                    className="w-full"
                                >
                                    Xem chi tiết Firmware
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/templates?tab=firmwares" className="flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Trở về
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Chọn File Firmware
                            </CardTitle>
                            <CardDescription>Upload file firmware (.ino, .cpp) với kích thước tối đa 10MB</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!selectedFile ? (
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center hover:border-muted-foreground/50 transition-all duration-200 hover:bg-muted/20">
                                    <input
                                        type="file"
                                        accept=".ino, .cpp, .txt"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="firmware-file"
                                    />
                                    <label htmlFor="firmware-file" className="cursor-pointer">
                                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                            <Upload className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-semibold">Chọn file firmware</h3>
                                            <p className="text-muted-foreground">Kéo thả file vào đây hoặc nhấn để chọn từ máy tính</p>
                                        </div>
                                    </label>
                                    {error.file && <p className="text-red-500 text-sm">{error.file}</p>}
                                </div>
                            ) : (
                                <div className="border rounded-xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-lg">{selectedFile.name}</p>
                                                <p className="text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                                                <Badge variant="outline" className="mt-1">
                                                    {selectedFile.name.split(".").pop()?.toUpperCase()} File
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={removeFile}
                                            disabled={isUploading}
                                            className="hover:bg-red-100 hover:text-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {error.file && <p className="text-red-500 text-sm">{error.file}</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Thông tin Firmware
                            </CardTitle>
                            <CardDescription>Điền thông tin chi tiết về phiên bản firmware</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="version" className="text-base font-medium">
                                        Tên firmware *
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Firmware 1.0.0"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={isUploading}
                                        className="h-12"
                                    />
                                    <p className="text-sm text-muted-foreground">Ví dụ: 2.1.0, 1.5.3</p>
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
                                            disabled={isUploading}
                                            className="h-12"
                                        />
                                        <p className="text-sm text-muted-foreground">Ví dụ: 2.1.0, 1.5.3</p>
                                        {error.version && <p className="text-red-500 text-sm">{error.version}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="template_id" className="text-base font-medium">
                                            Device Template *
                                        </Label>
                                        <Select
                                            value={formData.id}
                                            onValueChange={(value) => {
                                                const selectedTemplate = deviceTemplates.find((t) => t.id === value);
                                                if (selectedTemplate) {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        id: value,
                                                    }));
                                                }
                                            }}
                                            disabled={isUploading}
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
                                {formData.name && (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="is_mandatory"
                                                checked={formData.is_mandatory}
                                                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_mandatory: checked }))}
                                                disabled={isUploading}
                                            />
                                            <Label
                                                htmlFor="is_mandatory"
                                                className="flex items-center gap-2 cursor-pointer text-base font-medium"
                                            >
                                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                                Phiên bản firmware bắt buộc
                                            </Label>
                                        </div>
                                        {formData.is_mandatory && (
                                            <div className="ml-8 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                                <p className="text-sm text-orange-700">
                                                    ⚠️ Tất cả thiết bị {formData.name} chỉ sử dụng phiên bản này
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

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
                                        disabled={isUploading}
                                        rows={4}
                                        className="resize-none"
                                    />
                                    {error.note && <p className="text-red-500 text-sm">{error.note}</p>}
                                </div>

                                {isUploading && (
                                    <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Đang upload firmware...</span>
                                            <span className="text-sm font-mono">{uploadProgress}%</span>
                                        </div>
                                        <Progress value={uploadProgress} className="w-full h-2" />
                                        <p className="text-sm text-muted-foreground">Vui lòng không đóng trang trong quá trình upload</p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-4 pt-6 border-t">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate("/admin/templates?tab=firmware")}
                                        disabled={isUploading}
                                        size="lg"
                                    >
                                        Hủy bỏ
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!selectedFile || isUploading || !formData.version.trim() || !formData.id}
                                        size="lg"
                                        className="min-w-[160px]"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Upload className="mr-2 h-4 w-4 animate-spin" />
                                                Đang upload...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Firmware
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
                                Hướng dẫn Upload
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
                                <h4 className="font-medium mb-2 text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    Yêu cầu file
                                </h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Định dạng: .ino, .cpp</li>
                                    <li>• Kích thước tối đa: 10MB</li>
                                    <li>• File phải được kiểm tra trước khi upload</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-blue-600 flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Quy trình duyệt
                                </h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Upload → Kiểm tra tự động</li>
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
                                <li>• Chỉ upload firmware từ nguồn tin cậy</li>
                                <li>• Kiểm tra kỹ trước khi đánh dấu bắt buộc</li>
                                <li>• Firmware sẽ được quét virus tự động</li>
                                <li>• Backup firmware cũ trước khi triển khai</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}