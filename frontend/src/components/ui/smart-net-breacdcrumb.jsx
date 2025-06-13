import * as React from "react"
import { ChevronRight, Home, Eye, Plus, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"

const Breadcrumb = React.forwardRef(({ ...props }, ref) => (
    <nav
        ref={ref}
        aria-label="breadcrumb"
        {...props}
    />
))
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
    <ol
        ref={ref}
        className={cn(
            "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground",
            className
        )}
        {...props}
    />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
    <li
        ref={ref}
        className={cn("inline-flex items-center gap-1.5", className)}
        {...props}
    />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : Link

    return (
        <Comp
            ref={ref}
            className={cn(
                "transition-colors hover:text-foreground [&[data-state=active]]:text-foreground",
                className
            )}
            {...props}
        />
    )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
    <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn("font-normal text-foreground", className)}
        {...props}
    />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({ children, className, ...props }) => (
    <li
        role="presentation"
        aria-hidden="true"
        className={cn("[&>svg]:size-3.5", className)}
        {...props}
    >
        {children ?? <ChevronRight />}
    </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

// Custom Breadcrumb Component
const AdminBreadcrumb = () => {
    const location = useLocation()
    const pathnames = location.pathname.split('/').filter((x) => x)

    const breadcrumbMap = {
        'admin': 'Admin',
        'dashboard': 'Dashboard',
        'analytics': 'Thống kê',
        'reports': 'Báo cáo',
        'templates': 'Khuôn mẫu',
        'planning': 'Kế hoạch',
        'products': 'Sản phẩm',
        'orders': 'Đơn hàng',
        'slideshows': 'Slideshow',
        'role': 'Chức vụ & Quyền',
        'employees': 'Nhân viên',
        'customers': 'Khách hàng',
        'units': 'Đơn vị tính',
        'warranty-times': 'Thời Gian Bảo Hành',
        'contacts': 'Liên hệ',
        'reviews': 'Đánh giá',
        'blogs': 'Bài viết',
        'categories': 'Danh Mục',
        'attribute-groups': 'Nhóm thuộc tính',
        'warehouses': 'Kho hàng',
        'import': 'Nhập kho',
        'export': 'Xuất kho',
    }

    // Function to get action type and display name
    const getActionInfo = (pathname) => {
        if (pathname.endsWith('/add') || pathname.endsWith('/create')) {
            return { type: 'add', icon: Plus, label: 'Thêm mới' }
        }
        if (pathname.endsWith('/edit') || pathname.endsWith('/update')) {
            return { type: 'edit', icon: Edit, label: 'Chỉnh sửa' }
        }
        if (pathname.endsWith('/view') || pathname.endsWith('/detail')) {
            return { type: 'view', icon: Eye, label: 'Chi tiết' }
        }
        // Check for ID pattern (numeric or UUID)
        if (/\/\d+$/.test(pathname) || /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pathname)) {
            return { type: 'view', icon: Eye, label: 'Chi tiết' }
        }
        return null
    }

    // Find index of action in pathnames
    const actionIndex = pathnames.findIndex(
        (name) =>
            ['add', 'create', 'edit', 'update', 'view', 'detail'].includes(name) ||
            /^\d+$/.test(name) ||
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(name)
    )

    // Only render up to parent of action
    const lastIndex = actionIndex === -1 ? pathnames.length : actionIndex

    // Function to get parent route
    const getParentRoute = (pathname) => {
        // Remove action and ID from pathname to get parent route
        return pathname
            .replace(/\/add$/, '')
            .replace(/\/create$/, '')
            .replace(/\/edit$/, '')
            .replace(/\/update$/, '')
            .replace(/\/view$/, '')
            .replace(/\/detail$/, '')
            .replace(/\/\d+$/, '')
            .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, '')
    }

    // Function to get item name from URL or use default
    const getItemName = (pathname) => {
        // Extract ID from URL
        const idMatch = pathname.match(/\/(\d+)$/) || pathname.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i)
        if (idMatch) {
            return `ID: ${idMatch[1]}`
        }
        return 'Chi tiết'
    }

    const actionInfo = getActionInfo(location.pathname)
    const parentRoute = actionInfo ? getParentRoute(location.pathname) : null

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/admin/dashboard" className="flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            <span>Trang chủ</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                
                {pathnames.slice(0, lastIndex).map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
                    const isLast = index === lastIndex - 1 // Sửa lại điều kiện này
                    const displayName = breadcrumbMap[name] || name

                    return (
                        <React.Fragment key={name}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast && !actionInfo ? (
                                    <BreadcrumbPage className="text-blue-500 font-bold">{displayName}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={routeTo}>{displayName}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}

                {/* Render action breadcrumb if it's an action page */}
                {actionInfo && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-blue-500 font-bold flex items-center gap-1">
                                <actionInfo.icon className="h-4 w-4" />
                                <span>{actionInfo.label}</span>
                                {actionInfo.type === 'view' && (
                                    <span className="text-gray-500 text-xs ml-1">
                                        ({getItemName(location.pathname)})
                                    </span>
                                )}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    AdminBreadcrumb,
}