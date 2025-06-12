import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "@/components/layout/defaultLayout";
import HomePage from "@/pages/User/home/Home.page.jsx";
import SearchPage from "@/pages/User/Search.page.jsx";
import ProductDetailPage from "@/pages/User/ProductDetail.page.jsx";
import CartPage from "@/pages/User/Cart.page";
import CheckoutPage from "@/pages/User/checkout/Checkout.page.jsx";
import ProfileLayout from "@/components/layout/ProfileLayout";

// Profile
import ProfileInfo from "@/pages/User/Profile/Info.jsx";
import OrdersPage from "@/pages/User/Profile/Orders.jsx";
import LikedPage from "@/pages/User/Profile/Liked.jsx";
import AddressesPage from "@/pages/User/Profile/Address.jsx";
//Kết thúc

import AdminLayout from "@/components/layout/AdminLayout";
import SlideshowManagerPage from "@/pages/Admin/slideshowManager";
import BlogListPage from "@/pages/User/BlogList.page.jsx";
import BlogDetailPage from "@/pages/User/BlogDetail.page.jsx";
import ContactPage from "@/pages/User/Contact.page.jsx";
import UnitManagerPage from "@/pages/Admin/unitManager";
import AddUnit from "@/pages/Admin/unitManager/AddUnit.jsx";
import EditUnit from "@/pages/Admin/unitManager/EditUnit";
import WarehouseManagerPage from "@/pages/Admin/warehouseManager";
import AddWarehouse from "@/pages/Admin/warehouseManager/AddWarehouse";
import EditWarehouse from "@/pages/Admin/warehouseManager/EditWarehouse";
import WarrantyTimeManagerPage from "@/pages/Admin/warrantyTimeManager";
import AddWarrantyTime from "@/pages/Admin/warrantyTimeManager/AddWarrantyTime";
import EditWarrantyTime from "@/pages/Admin/warrantyTimeManager/EditWarrantyTime";
import AddSlideshow from "@/pages/Admin/slideshowManager/AddSlideshow";
import EditSlideshow from "@/pages/Admin/slideshowManager/EditSlideshow";
import ContactManagerPage from "@/pages/Admin/contactManager";
import ContactEdit from "@/pages/Admin/contactManager/EditContact";
import ReviewManagerPage from "@/pages/Admin/reviewManager";
import BlogManagerPage from "@/pages/Admin/blogManager";
import AddBlog from "@/pages/Admin/blogManager/AddBlog";
import EditBlog from "@/pages/Admin/blogManager/EditBlog";
import CategoryManagerPage from "@/pages/Admin/categoryManager/index.jsx";
import AddCategoryPage from "@/pages/Admin/categoryManager/AddCategory.jsx";
import EditCategoryPage from "@/pages/Admin/categoryManager/EditCategory.jsx";
import CreateImportWarehousePage from "@/pages/Admin/warehouse/import/create";
import CreateExportWarehousePage from "@/pages/Admin/warehouse/export/create";
import UserManagerPage from "@/pages/Admin/userManager";
import ProductManagerPage from "@/pages/Admin/productManager";
import EmployeeManagerPage from "@/pages/Admin/employeeManager";
import AddUserPage from "@/pages/Admin/userManager/AddUser";
import EditUserPage from "@/pages/Admin/userManager/EditUser";
import AddProductPage from "@/pages/Admin/productManager/AddProduct";
import EditProductPage from "@/pages/Admin/productManager/EditProduct";
import TemplateManagement from "@/components/common/template/template-management";
import NewFirmwarePage from "@/components/common/firmware/upload-firmware";
import FirmwareDetailPage from "@/components/common/firmware/detail-firmware";
import EditFirmwarePage from "@/components/common/firmware/edit-firmware";
import StatePrimary from "@/components/common/tracking/StatePrimary";
import AttributeGroupPage from "@/pages/Admin/attribute_groupManager";
import PlanningManagement from "@/pages/Admin/planningManager/page";
import EmployeeLogin from "@/components/common/auth/EmployeeLogin";
import Permission from "@/pages/Admin/roleManager/permission";
import RoleManager from "@/pages/Admin/roleManager";
import EditRole from "@/pages/Admin/roleManager/edit";
import CreateRole from "@/pages/Admin/roleManager/create";
import OrderManagerPage from "@/pages/Admin/orderManager";
import CreateOrderPage from "@/pages/Admin/orderManager/create";
import ImportWarehousePage from "@/pages/Admin/warehouse/import";
import ExportWarehousePage from "@/pages/Admin/warehouse/export";
import ImportWarehouseDetailPage from "@/pages/Admin/warehouse/import/detail";
import ExportWarehouseDetailPage from "@/pages/Admin/warehouse/export/detail";
import OrderDetailPage from "@/pages/Admin/orderManager/detail";
import AddEmployeeForm from "@/pages/Admin/employeeManager/AddEmployee";
import EditEmployeeForm from "@/pages/Admin/employeeManager/EditEmployee";
import SalesAnalytics from "@/pages/Admin/SalesAnalytics";
import Dashboard from "@/pages/Admin/Dashboard";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "products/:slug",
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "profile/",
        element: <ProfileLayout />,
        children: [
          {
            path: "info",
            element: <ProfileInfo />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "liked",
            element: <LikedPage />,
          },
          {
            path: "addresses",
            element: <AddressesPage />,
          },
          {
            path: "change-password",
            element: <h1>Thay đổi mật khẩu</h1>,
          },
        ],
      },
      {
        path: "blog",
        element: <BlogListPage />,
      },
      {
        path: "blog/:id",
        element: <BlogDetailPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <EmployeeLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "analytics",
        element: <SalesAnalytics />,
      },
      {
        path: "categories",
        element: <CategoryManagerPage />,
      },
      {
        path: "categories/create",
        element: <AddCategoryPage />,
      },
      {
        path: "categories/edit/:id",
        element: <EditCategoryPage />,
      },
      {
        path: "attribute-groups",
        element: <AttributeGroupPage />,
      },
      {
        path: "units",
        element: <UnitManagerPage />,
      },
      {
        path: "units/add",
        element: <AddUnit />,
      },
      {
        path: "units/edit/:id",
        element: <EditUnit />,
      },
      {
        path: "warehouses",
        element: <WarehouseManagerPage />,
      },
      {
        path: "warehouses/add",
        element: <AddWarehouse />,
      },
      {
        path: "warehouses/edit/:id",
        element: <EditWarehouse />,
      },
      {
        path: "warranty-times",
        element: <WarrantyTimeManagerPage />,
      },
      {
        path: "warranty-times/add",
        element: <AddWarrantyTime />,
      },
      {
        path: "warranty-times/edit/:id",
        element: <EditWarrantyTime />,
      },
      {
        path: "slideshows",
        element: <SlideshowManagerPage />,
      },
      {
        path: "slideshows/add",
        element: <AddSlideshow />,
      },
      {
        path: "slideshows/edit/:id",
        element: <EditSlideshow />,
      },
      {
        path: "contacts",
        element: <ContactManagerPage />,
      },
      {
        path: "contacts/edit/:id",
        element: <ContactEdit />,
      },
      {
        path: "reviews",
        element: <ReviewManagerPage />,
      },
      {
        path: "blogs",
        element: <BlogManagerPage />,
      },
      {
        path: "blogs/add",
        element: <AddBlog />,
      },
      {
        path: "blogs/edit/:id",
        element: <EditBlog />,
      },
      {
        path: 'customers',
        element: <UserManagerPage />,
      },
      {
        path: 'employees',
        element: <EmployeeManagerPage />,
      },
      {
        path: 'employees/add',
        element: <AddEmployeeForm />
      },
      {
        path: 'employees/edit/:id',
        element: <EditEmployeeForm />
      },
      {
        path: 'users/add',
        element: <AddUserPage />,
      },
      {
        path: 'customers/edit/:id',
        element: <EditUserPage />,
      },
      {
        path: 'products/',
        element: <ProductManagerPage />,
      },
      {
        path: 'products/add',
        element: <AddProductPage />
      },
      {
        path: 'products/edit/:id',
        element: <EditProductPage />
      },
      {
        path: 'templates',
        element: <TemplateManagement />
      },
      {
        path: 'firmware/new',
        element: <NewFirmwarePage />
      },
      {
        path: 'firmware/:id',
        element: <FirmwareDetailPage />
      },
      {
        path: 'firmware/edit/:id',
        element: <EditFirmwarePage />
      },
      {
        path: 'planning',
        element: <PlanningManagement />
      },
      {
        path: 'production-trackings',
        element: <StatePrimary />
      },
      {
        path: 'role',
        element: <RoleManager />
      },
      {
        path: 'role/permission/:id',
        element: <Permission />
      },
      {
        path: 'role/edit/:id',
        element: <EditRole />
      },
      {
        path: 'role/create',
        element: <CreateRole />
      },
      {
        path: 'orders',
        element: <OrderManagerPage />
      },
      {
        path: 'orders/detail/:id',
        element: <OrderDetailPage />
      },
      {
        path: 'orders/create',
        element: <CreateOrderPage />
      },
      {
        path: 'warehouses/import',
        element: <ImportWarehousePage />
      },
      {
        path: 'warehouses/import/detail/:id',
        element: <ImportWarehouseDetailPage />
      },
      {
        path: 'warehouses/export',
        element: <ExportWarehousePage />
      },
      {
        path: 'warehouse/import/create',
        element: <CreateImportWarehousePage />
      },
      {
        path: 'warehouses/export/detail/:id',
        element: <ExportWarehouseDetailPage />
      },
      {
        path: 'warehouses/export/create',
        element: <CreateExportWarehousePage />
      },
    ],
  },
]);