import { useEffect, useState } from "react";
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
    Trash2,
    Loader2,
    Pencil
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate, removeVietnameseTones } from "@/utils/format";
import Swal from "sweetalert2";
import axiosIOTPublic from "@/apis/clients/iot.private.client";

export default function FirmwarePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [firmwareData, setFirmwareData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchFirmwareData = async () => {
            try {
                const response = await axiosIOTPublic.get(`firmware`);

                console.log('response', response)
                if (response.success) {
                    setFirmwareData(response.data);
                }
            } catch (error) {
                console.error("Error fetching firmware data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFirmwareData();
    }, []);

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

    if (isLoading) {
        console.log('firmwareData', firmwareData)
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-10 w-10 animate-spin" />
        </div>
    }

    const handleDeleteFirmware = async (firmwareId) => {
        try {
            Swal.fire({
                title: 'Bạn có chắc chắn muốn xoá firmware này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xoá',
                cancelButtonText: 'Hủy bỏ'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await axiosIOTPublic.delete(`firmware/${firmwareId}`)
                    console.log('response', response)
                    if (response.success) {
                        Swal.fire({
                            title: 'Thành công',
                            text: response.message,
                            icon: 'success'
                        })
                    } else {
                        Swal.fire({
                            title: 'Lỗi',
                            text: response.message,
                            icon: 'error'
                        })
                    }
                }
            })
        } catch (error) {
            console.error("Error deleting firmware:", error);
        }
    }

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
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{firmware?.name}</div>
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
                                                            <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-900">
                                                                <Link to={`/admin/firmware/edit/${firmware.firmware_id}`}>
                                                                    <Pencil className="h-6 w-6" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                                                                <Link to={`/admin/firmware/${firmware.firmware_id}`}>
                                                                    <Eye className="h-6 w-6" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="ghost" size="sm"
                                                                className="text-red-600 hover:text-red-900"
                                                                onClick={() => handleDeleteFirmware(firmware.firmware_id)}
                                                            >
                                                                <Trash2 className="h-6 w-6" />
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