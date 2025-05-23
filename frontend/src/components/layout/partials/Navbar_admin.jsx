"use client"
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  FolderTree,
  ShoppingBag,
  FileText,
  Settings2,
  ChevronDown,
  LayoutDashboard,
  UserCog,
  PencilRuler,
  Warehouse,
  CalendarClock,
  Image,
  MessageSquareMore,
  MessageSquareDiff,
  Newspaper
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider

} from "@/components/ui/sidebar"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"


// CSS cho thanh cuộn tùy chỉnh
const scrollbarStyles = `
  /* Tùy chỉnh thanh cuộn cho sidebar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    transition: background 0.2s ease;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  /* Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
  }
`
function Navbar_admin() {
  return (
    <SidebarProvider>
      <Sidebar className="bg-[#1F2937] text-white ">
        <SidebarHeader className="py-3 pe-18 pb-5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div>
                  <div className="flex flex-col gap-0.5 leading-none ml-2">
                    <span className="font-semibold">SmartNet Solutions </span>
                    <span className="text-xs opacity-70">Admin Portal</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* Tổng Quan */}
          <SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible w-full">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  Tổng Quan
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/dashboard">
                          <LayoutDashboard className="size-4" />
                          <span>Dashboard</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>

          {/* Quản Lý */}
          <SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible w-full">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  Quản Lý
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/employees">
                          <UserCog className="size-4" />
                          <span>Quản lý nhân viên</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/users">
                          <Users className="size-4" />
                          <span>Người Dùng</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/products">
                          <Package className="size-4" />
                          <span>Sản Phẩm</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/orders">
                          <ShoppingCart className="size-4" />
                          <span>Đơn Hàng</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/units">
                          <PencilRuler className="size-4" />
                          <span>Đơn Vị Tính</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/warehouses">
                          <Warehouse className="size-4" />
                          <span>Kho Hàng</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/warranty-times">
                          <CalendarClock className="size-4" />
                          <span>Thời Gian Bảo Hành</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/slideshows">
                          <Image className="size-4" />
                          <span>Slideshow</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/contacts">
                          <MessageSquareMore className="size-4" />
                          <span>Quản Lý Liên Hệ</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/reviews">
                          <MessageSquareDiff className="size-4" />
                          <span>Quản Lý Đánh Giá</span>
                          </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/blogs">
                          <Newspaper className="size-4" />
                          <span>Quản Lý Bài Viết</span>
                          </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>

          {/* Danh Mục */}
          <SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible w-full">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  Danh Mục
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/categories/products">
                          <ShoppingBag className="size-4" />
                          <span>Danh Mục Sản Phẩm</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/categories/blog">
                          <FileText className="size-4" />
                          <span>Danh Mục Bài Viết</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/categories">
                          <Settings2 className="size-4" />
                          <span>Quản Lý Danh Mục</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>

          {/* Danh Mục */}
          <SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible w-full">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  Thuộc tính
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/admin/attribute-groups">
                          <FolderTree className="size-4" />
                          <span>Nhóm thuộc tính</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
          {/* Cài Đặt */}
          <SidebarGroup>
            <Collapsible className="group/collapsible w-full">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  Cài Đặt
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/settings/general">
                          <Settings className="size-4" />
                          <span>Thiết Lập Chung</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/settings/appearance">
                          <Settings2 className="size-4" />
                          <span>Giao Diện</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/help">
                  <HelpCircle className="size-4" />
                  <span>Trợ Giúp</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}

export default Navbar_admin;