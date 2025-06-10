"use client"
import {
	Home,
	BarChart3,
	Users,
	FileText,
	ChevronDown,
	Cpu,
	Activity,
	UserCog,
	Package,
	Image,
	CalendarClock,
	MessageSquareMore,
	Star,
	Newspaper,
	ShoppingBag,
	FolderTree,
	Warehouse,
	UserLock,
} from "lucide-react"

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "@/components/ui/sidebar"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Link } from "react-router-dom"

export default function EcommerceSidebar() {

	return (
		<SidebarProvider>
			<Sidebar className="bg-gradient-to-b from-slate-950 to-blue-800 text-white w-[14vw] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
				<SidebarHeader className="border-b border-blue-600 p-6 h-[10vh]">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" className="hover:bg-blue-600/50 p-0">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
										<Home className="h-6 w-6 text-white" />
									</div>
									<div className="flex flex-col gap-0.5 leading-none">
										<span className="font-bold text-lg text-white">SmartNet</span>
										<span className="font-bold text-lg text-white">Solutions</span>
									</div>
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<SidebarContent className="px-3">
					{/* Tổng Quan */}
					<SidebarGroup>
						<Collapsible defaultOpen className="group/collapsible w-full">
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="flex w-full items-center justify-between text-blue-200 font-semibold hover:text-white transition-colors py-2 px-3 rounded-md hover:bg-blue-600/30">
									TỔNG QUAN
									<ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/dashboard">
													<BarChart3 className="h-4 w-4" />
													<span>Dashboard</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/analytics">
													<Activity className="h-4 w-4" />
													<span>Thống kê</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/reports">
													<FileText className="h-4 w-4" />
													<span>Báo cáo</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</Collapsible>
					</SidebarGroup>

					{/* SẢN XUẤT  */}
					<SidebarGroup>
						<Collapsible defaultOpen className="group/collapsible w-full">
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="flex w-full items-center justify-between text-blue-200 font-semibold hover:text-white transition-colors py-2 px-3 rounded-md hover:bg-blue-600/30 w-full">
									Sản xuất
									<ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/templates?tab=templates">
													<Warehouse className="h-4 w-4" />
													<span>Khuôn mẫu</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/planning">
													<Users className="size-4" />
													<span>Kế hoạch</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</Collapsible>
					</SidebarGroup>

					{/* Quản Lý */}
					<SidebarGroup>
						<Collapsible defaultOpen className="group/collapsible">
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="flex w-full items-center justify-between text-blue-200 font-semibold hover:text-white transition-colors py-2 px-3 rounded-md hover:bg-blue-600/30">
									QUẢN LÝ
									<ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent className="w-full">
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/products">
													<Cpu className="h-4 w-4" />
													<span>Sản phẩm</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/orders">
													<Package className="h-4 w-4" />
													<span>Đơn hàng</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/slideshows">
													<Image className="size-4" />
													<span>Slideshow</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/role">
													<UserLock className="h-4 w-4" />
													<span>Chức vụ & Quyền</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="bg-blue-600 text-white hover:bg-blue-500 transition-all duration-200 py-2.5"
											>
												<Link to="/admin/employees">
													<UserCog className="size-4" />
													<span>Nhân viên</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/customers">
													<Users className="size-4" />
													<span>Khách hàng</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/units">
													<Package className="size-4" />
													<span>Đơn vị tính</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/warranty-times">
													<CalendarClock className="size-4" />
													<span>Thời Gian Bảo Hành</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/contacts">
													<MessageSquareMore className="size-4" />
													<span>Liên hệ</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/reviews">
													<Star className="size-4" />
													<span>Đánh giá</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/blogs">
													<Newspaper className="size-4" />
													<span>Bài viết</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/categories">
													<ShoppingBag className="size-4" />
													<span>Danh Mục</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<Link to="/admin/attribute-groups">
													<FolderTree className="size-4" />
													<span>Nhóm thuộc tính</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</Collapsible>
					</SidebarGroup>

					{/* KHO  */}
					<SidebarGroup>
						<Collapsible defaultOpen className="group/collapsible w-full">
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="flex w-full items-center justify-between text-blue-200 font-semibold hover:text-white transition-colors py-2 px-3 rounded-md hover:bg-blue-600/30 w-full">
									KHO
									<ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/warehouses">
													<Warehouse className="h-4 w-4" />
													<span>Kho hàng</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="bg-blue-600 text-white hover:bg-blue-500 transition-all duration-200 py-2.5"
											>
												<Link to="/admin/warehouses/import">
													<UserCog className="size-4" />
													<span>Nhập kho</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												className="text-blue-100 hover:bg-blue-600/50 hover:text-white transition-all duration-200 py-2.5"
											>
												<Link to="/admin/warehouses/export">
													<Users className="size-4" />
													<span>Xuất kho</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</Collapsible>
					</SidebarGroup>

				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
	)
}
