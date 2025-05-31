import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Upload,
    CheckCircle,
    Clock,
    AlertTriangle,
    Code,
    Eye,
    Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate, removeVietnameseTones } from "@/utils/format";

// Sample firmware data
const firmwareData = [
    {
        firmware_id: 1,
        version: "v2.1.0",
        file_path: "/firmware/camera_v2.1.0.bin",
        template_id: 1,
        template_name: "Camera Xiaomi 360°",
        is_mandatory: true,
        created_at: "2024-01-15T10:30:00Z",
        tested_at: "2024-01-16T14:20:00Z",
        is_approved: true,
        updated_at: "2024-01-16T15:00:00Z",
        is_deleted: false,
        note: "Cập nhật tính năng phát hiện chuyển động",
        file_size: "2.5 MB",
        download_count: 156,
    },
    {
        firmware_id: 2,
        version: "v1.8.5",
        file_path: "/firmware/light_v1.8.5.bin",
        template_id: 2,
        template_name: "Đèn thông minh Philips",
        is_mandatory: false,
        created_at: "2024-01-10T09:15:00Z",
        tested_at: null,
        is_approved: false,
        updated_at: "2024-01-10T09:15:00Z",
        is_deleted: false,
        note: "Sửa lỗi kết nối WiFi",
        file_size: "1.2 MB",
        download_count: 89,
    },
    {
        firmware_id: 3,
        version: "v3.0.0-beta",
        file_path: "/firmware/sensor_v3.0.0-beta.bin",
        template_id: 3,
        template_name: "Cảm biến nhiệt độ",
        is_mandatory: false,
        created_at: "2024-01-20T16:45:00Z",
        tested_at: "2024-01-21T10:30:00Z",
        is_approved: false,
        updated_at: "2024-01-21T11:00:00Z",
        is_deleted: false,
        note: "Phiên bản beta - thêm tính năng AI",
        file_size: "3.1 MB",
        download_count: 23,
    },
];

export default function FirmwarePage() {
    const [searchTerm, setSearchTerm] = useState("");

    const getStatusBadge = (firmware) => {
        if (!firmware.is_approved && !firmware.tested_at) {
            return (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Chờ kiểm tra
                </Badge>
            );
        }
        if (firmware.tested_at && !firmware.is_approved) {
            return <Badge variant="destructive">Không được duyệt</Badge>;
        }
        if (firmware.is_approved) {
            return (
                <Badge variant="default" className="bg-green-100 text-green-800">
                    Đã duyệt
                </Badge>
            );
        }
        return <Badge variant="secondary">Chưa xác định</Badge>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Quản lý firmware</h2>
                </div>
                <Link to="/admin/firmware/new">
                    <Button className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>Tạo Firmware</span>
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Firmware</CardTitle>
                        <Code className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{firmwareData.length}</div>
                        <p className="text-xs text-muted-foreground">Tất cả phiên bản</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {firmwareData.filter((f) => f.is_approved).length}
                        </div>
                        <p className="text-xs text-muted-foreground">Sẵn sàng triển khai</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {firmwareData.filter((f) => !f.is_approved).length}
                        </div>
                        <p className="text-xs text-muted-foreground">Cần kiểm tra</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bắt buộc</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {firmwareData.filter((f) => f.is_mandatory).length}
                        </div>
                        <p className="text-xs text-muted-foreground">Cập nhật bắt buộc</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="firmware" className="space-y-4">

                {/* Firmware Tab */}
                <TabsContent value="firmware" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Danh sách Firmware</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Search */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Tìm kiếm firmware..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Firmware Table */}
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Phiên bản</TableHead>
                                            <TableHead>Template</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Loại</TableHead>
                                            <TableHead>Ngày tạo</TableHead>
                                            <TableHead>Ngày sửa</TableHead>
                                            <TableHead className="text-center">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {firmwareData
                                            .filter((firmware) =>
                                                removeVietnameseTones(firmware.version.toLowerCase()).includes(
                                                    removeVietnameseTones(searchTerm.toLowerCase())
                                                ) ||
                                                removeVietnameseTones(firmware.template_name.toLowerCase()).includes(
                                                    removeVietnameseTones(searchTerm.toLowerCase())
                                                )
                                            )
                                            .map((firmware) => (
                                                <TableRow key={firmware.firmware_id}>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{firmware.version}</span>
                                                            {firmware.version.includes("beta") && (
                                                                <Badge variant="outline" className="w-fit text-xs mt-1">
                                                                    BETA
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{firmware.template_name}</div>
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(firmware)}</TableCell>
                                                    <TableCell>
                                                        {firmware.is_mandatory ? (
                                                            <Badge variant="destructive" className="text-xs">
                                                                Bắt buộc
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-xs">
                                                                Tùy chọn
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{formatDate(firmware.created_at)}</TableCell>
                                                    <TableCell>{formatDate(firmware.updated_at)}</TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {/* Quick Actions */}
                                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                                                                <Link to={`/admin/firmware/${firmware.firmware_id}`}>
                                                                    <Eye className="h-6 w-6" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                                                                <Link to={`/admin/firmware/${firmware.firmware_id}`}>
                                                                    <Trash2 className="h-6 w-6" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}