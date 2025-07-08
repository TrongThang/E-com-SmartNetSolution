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
import SlideshowManagerPage from "@/pages/Admin_1/slideshowManager";
import BlogListPage from "@/pages/User/BlogList.page.jsx";
import BlogDetailPage from "@/pages/User/BlogDetail.page.jsx";
import ContactPage from "@/pages/User/Contact.page.jsx";
import UnitManagerPage from "@/pages/Admin_1/unitManager";
import AddUnit from "@/pages/Admin_1/unitManager/AddUnit.jsx";
import EditUnit from "@/pages/Admin_1/unitManager/EditUnit";
import WarehouseManagerPage from "@/pages/Admin_1/warehouseManager";
import AddWarehouse from "@/pages/Admin_1/warehouseManager/AddWarehouse";
import EditWarehouse from "@/pages/Admin_1/warehouseManager/EditWarehouse";
import WarrantyTimeManagerPage from "@/pages/Admin_1/warrantyTimeManager";
import AddWarrantyTime from "@/pages/Admin_1/warrantyTimeManager/AddWarrantyTime";
import EditWarrantyTime from "@/pages/Admin_1/warrantyTimeManager/EditWarrantyTime";
import AddSlideshow from "@/pages/Admin_1/slideshowManager/AddSlideshow";
import EditSlideshow from "@/pages/Admin_1/slideshowManager/EditSlideshow";
import ContactManagerPage from "@/pages/Admin_1/contactManager";
import ContactEdit from "@/pages/Admin_1/contactManager/EditContact";
import ReviewManagerPage from "@/pages/Admin_1/reviewManager";
import BlogManagerPage from "@/pages/Admin_1/blogManager";
import AddBlog from "@/pages/Admin_1/blogManager/AddBlog";
import EditBlog from "@/pages/Admin_1/blogManager/EditBlog";
import CategoryManagerPage from "@/pages/Admin_1/categoryManager/index.jsx";
import AddCategoryPage from "@/pages/Admin_1/categoryManager/AddCategory.jsx";
import EditCategoryPage from "@/pages/Admin_1/categoryManager/EditCategory.jsx";
import CreateImportWarehousePage from "@/pages/Admin_1/warehouse/import/create";
import CreateExportWarehousePage from "@/pages/Admin_1/warehouse/export/create";
import UserManagerPage from "@/pages/Admin_1/userManager";
import ProductManagerPage from "@/pages/Admin_1/productManager";
import EmployeeManagerPage from "@/pages/Admin_1/employeeManager";
import AddUserPage from "@/pages/Admin_1/userManager/AddUser";
import EditUserPage from "@/pages/Admin_1/userManager/EditUser";
import AddProductPage from "@/pages/Admin_1/productManager/AddProduct";
import EditProductPage from "@/pages/Admin_1/productManager/EditProduct";
import TemplateManagement from "@/components/common/template/template-management";
import NewFirmwarePage from "@/components/common/firmware/upload-firmware";
import FirmwareDetailPage from "@/components/common/firmware/detail-firmware";
import EditFirmwarePage from "@/components/common/firmware/edit-firmware";
import StatePrimary from "@/components/common/tracking/StatePrimary";
import AttributeGroupPage from "@/pages/Admin_1/attribute_groupManager";
import PlanningManagement from "@/pages/Admin_1/planningManager/page";
import EmployeeLogin from "@/components/common/auth/EmployeeLogin";
import Permission from "@/pages/Admin_1/roleManager/permission";
import RoleManager from "@/pages/Admin_1/roleManager";
import EditRole from "@/pages/Admin_1/roleManager/edit";
import CreateRole from "@/pages/Admin_1/roleManager/create";
import OrderManagerPage from "@/pages/Admin_1/orderManager";
import CreateOrderPage from "@/pages/Admin_1/orderManager/create";
import ImportWarehousePage from "@/pages/Admin_1/warehouse/import";
import ExportWarehousePage from "@/pages/Admin_1/warehouse/export";
import ImportWarehouseDetailPage from "@/pages/Admin_1/warehouse/import/detail";
import ExportWarehouseDetailPage from "@/pages/Admin_1/warehouse/export/detail";
import OrderDetailPage from "@/pages/Admin_1/orderManager/detail";
import AddEmployeeForm from "@/pages/Admin_1/employeeManager/AddEmployee";
import EditEmployeeForm from "@/pages/Admin_1/employeeManager/EditEmployee";
import SalesAnalytics from "@/pages/Admin_1/SalesAnalytics";
import Dashboard from "@/pages/Admin_1/Dashboard";
import ProfileEmployee from "@/pages/Admin_1/ProfileEmployee";
import ChangePassword from "@/pages/Admin_1/ChangePassword";
import ChangePasswordUser from "@/pages/User/Profile/ChangePassword";
import FCMTestPage from "@/pages/Admin_1/FCMTestPage";

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
            element: <ChangePasswordUser />,
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
        path: 'warehouses/import/create',
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
      {
        path: 'profile',
        element: <ProfileEmployee />
      },
      {
        path: 'profile/change-password',
        element: <ChangePassword />
      }
    ],
  },
  {
    path: '/admin/fcm-test',
    element: <FCMTestPage />
  }
]);