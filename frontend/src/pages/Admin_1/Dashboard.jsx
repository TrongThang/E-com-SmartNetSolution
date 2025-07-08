import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ShoppingCart,
    Factory,
    Package,
    ArrowRight,
    BarChart3,
    Users,
    Settings,
    Bell,
    Search,
    Menu,
    Home,
    Image,
    Box,
    List,
    Tags,
    FileText,
    UserCheck,
    TrendingUp,
    DollarSign,
    Wrench,
    PlayCircle,
    Calendar,
    Activity,
    Download,
    Upload,
    ClipboardCheck,
    PieChart,
    Code,
    Codesandbox,
    Blocks,
    PencilRuler,
    Timer,
    Mail,
    Star,
    BookMarked,
    ShieldAlert,
    ScanEye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(null);

    const processSteps = [
        {
            id: 1,
            title: "Sản Xuất",
            description: "Lập kế hoạch và giám sát quy trình sản xuất",
            icon: Factory,
            color: "bg-green-500",
            route: "/admin/production",
            details: "Tạo lệnh sản xuất, theo dõi tiến độ, quản lý máy móc",
            stats: "8 lệnh đang thực hiện",
            functions: [
                { name: "Linh kiện", route: "/admin/templates?tab=components", icon: Settings, color: "text-blue-600", bg: "bg-blue-50" },
                { name: "Firmware", route: "/admin/templates?tab=firmwares", icon: Code, color: "text-red-600", bg: "bg-red-50" },
                { name: "Công thức", route: "/admin/templates?tab=templates", icon: Codesandbox, color: "text-green-600", bg: "bg-green-50" },
                { name: "Kế hoạch", route: "/admin/planning", icon: Calendar, color: "text-orange-600", bg: "bg-orange-50" },
                { name: "Theo dõi sản xuất", route: "/admin/production-trackings", icon: ScanEye, color: "text-yellow-600", bg: "bg-yellow-50" },
            ]
        },
        {
            id: 2,
            title: "Quản Lý Kho",
            description: "Kiểm soát tồn kho và xuất nhập hàng hóa",
            icon: Package,
            color: "bg-purple-500",
            route: "/quan-ly-kho",
            details: "Nhập kho, xuất kho, kiểm kê tồn kho, cảnh báo hết hàng",
            stats: "95% tỷ lệ tồn kho",
            functions: [
                { name: "Vị trí kho", route: "/admin/warehouses", icon: List, color: "text-orange-600", bg: "bg-orange-50" },
                { name: "Nhập kho", route: "/admin/warehouses/import", icon: Download, color: "text-green-600", bg: "bg-green-50" },
                { name: "Xuất kho", route: "/admin/warehouses/export", icon: Upload, color: "text-red-600", bg: "bg-red-50" },
            ]
        },
        {
            id: 3,
            title: "Bán Hàng",
            description: "Quản lý đơn hàng, khách hàng và doanh thu",
            icon: ShoppingCart,
            color: "bg-blue-500",
            route: "/admin/analytics",
            details: "Tạo đơn hàng mới, theo dõi trạng thái đơn hàng, quản lý khách hàng",
            stats: "127 đơn hàng hôm nay",
            functions: [
                { name: "Slideshow", route: "/admin/slideshows", icon: Image, color: "text-purple-600", bg: "bg-purple-50" },
                { name: "Danh mục", route: "/admin/categories", icon: List, color: "text-green-600", bg: "bg-green-50" },
                { name: "Thuộc tính", route: "/admin/attribute-groups", icon: Blocks, color: "text-sky-600", bg: "bg-sky-50" },
                { name: "Đơn vị tính", route: "/admin/units", icon: PencilRuler, color: "text-indigo-600", bg: "bg-indigo-50" },
                { name: "Thời gian bảo hành", route: "/admin/warranty-times", icon: Timer, color: "text-rose-600", bg: "bg-rose-50" },
                { name: "Liên hệ", route: "/admin/contacts", icon: Mail, color: "text-orange-600", bg: "bg-orange-50" },
                { name: "Khách hàng", route: "/admin/customers", icon: UserCheck, color: "text-pink-600", bg: "bg-pink-50" },
                { name: "Bài viết", route: "/admin/blogs", icon: BookMarked, color: "text-orange-600", bg: "bg-orange-50" },
                { name: "Sản phẩm", route: "/admin/products", icon: Box, color: "text-blue-600", bg: "bg-blue-50" },
                { name: "Đơn hàng", route: "/admin/orders", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
                { name: "Quản lý đánh giá", route: "/admin/reviews", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
                { name: "Thống kê", route: "/admin/analytics", icon: DollarSign, color: "text-lime-600", bg: "bg-lime-50" },
            ]
        },
    ];

    const quickStats = [
        { label: "Doanh thu hôm nay", value: "125,000,000 VNĐ", change: "+12%" },
        { label: "Đơn hàng chờ xử lý", value: "23", change: "-5%" },
        { label: "Sản phẩm sắp hết", value: "7", change: "+2%" },
        { label: "Hiệu suất sản xuất", value: "87%", change: "+3%" }
    ];

    const handleNavigate = (route) => {
        navigate(route);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {quickStats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <Badge
                                        variant={stat.change.startsWith('+') ? 'default' : 'secondary'}
                                        className={stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                    >
                                        {stat.change}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Process Flow */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Quy Trình Hoạt Động
                    </h3>

                    <div className="space-y-8">
                        {processSteps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = activeStep === step.id;

                            return (
                                <div key={step.id} className="relative">
                                    <Card
                                        className={`transition-all duration-300 hover:shadow-xl ${isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''
                                            }`}
                                        onMouseEnter={() => setActiveStep(step.id)}
                                        onMouseLeave={() => setActiveStep(null)}
                                    >
                                        {/* Background Pattern */}
                                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                                            <div className={`w-full h-full ${step.color} rounded-full transform translate-x-16 -translate-y-16`}></div>
                                        </div>

                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-lg ${step.color} text-white`}>
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl font-bold text-gray-900">
                                                            {step.title}
                                                        </CardTitle>
                                                        <CardDescription className="text-gray-600">
                                                            {step.description}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <Badge variant="outline" className="text-xs">
                                                        Bước {step.id}
                                                    </Badge>
                                                    <Badge className="bg-gray-100 text-gray-700">
                                                        {step.stats}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-0">
                                            <div className="space-y-4">
                                                <p className="text-sm text-gray-700">{step.details}</p>

                                                {/* Function Cards */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {step.functions.map((func, funcIndex) => {
                                                        const IconComponent = func.icon;
                                                        return (
                                                            <div
                                                                key={funcIndex}
                                                                className={`group relative overflow-hidden ${func.bg} hover:shadow-lg rounded-xl p-5 cursor-pointer transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:-translate-y-1`}
                                                                onClick={() => handleNavigate(func.route)}
                                                            >
                                                                {/* Subtle gradient overlay */}
                                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                                <div className="relative z-10 text-center space-y-3">
                                                                    <div className={`w-12 h-12 mx-auto rounded-lg ${func.bg} border-2 border-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                                        <IconComponent className={`w-6 h-6 ${func.color}`} />
                                                                    </div>
                                                                    <div className={`text-sm font-semibold ${func.color} group-hover:text-gray-900 transition-colors duration-300`}>
                                                                        {func.name}
                                                                    </div>
                                                                </div>

                                                                {/* Hover effect indicator */}
                                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                        <span className="text-xs text-gray-500">
                                                            {step.functions.length} chức năng có sẵn
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Connecting Arrow */}
                                    {index < processSteps.length - 1 && (
                                        <div className="flex justify-center py-4">
                                            <div className="bg-white rounded-full p-3 shadow-lg border-2 border-gray-200">
                                                <ArrowRight className="h-5 w-5 text-gray-600 rotate-90" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                    <Button
                        variant="outline"
                        className="h-14 text-lg font-semibold bg-teal-500 hover:bg-teal-600 text-white"
                        onClick={() => handleNavigate('/admin/employees')}
                    >
                        <Users className="mr-2 h-5 w-5" />
                        Quản Lý Nhân viên
                    </Button>
                    <Button
                        variant="outline"
                        className="h-14 text-lg font-semibold bg-rose-600 hover:bg-rose-700 text-white"
                        onClick={() => handleNavigate('/admin/role')}
                    >
                        <ShieldAlert className="mr-2 h-5 w-5" />
                        Quản Lý Quyền & Chức vụ
                    </Button>
                    <Button
                        className="h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleNavigate('/admin/analytics')}
                    >
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Xem Thống kê
                    </Button>
                    <Button
                        variant="outline"
                        className="h-14 text-lg font-semibold"
                        onClick={() => handleNavigate('/admin/settings')}
                    >
                        <Settings className="mr-2 h-5 w-5" />
                        Cài Đặt Hệ Thống
                    </Button>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-500 text-sm">
                    <p>© 2025 Admin Dashboard - <span className="font-bold text-blue-600">SMS SmartNetSolution</span> - Phiên bản 1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;