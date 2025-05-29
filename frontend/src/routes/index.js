import DefaultLayout from "@/components/layout/defaultLayout";
import HomePage from "@/pages/user/home/Home.page.jsx";
import SearchPage from "@/pages/user/Search.page.jsx";
import ProductDetailPage from "@/pages/user/ProductDetail.page.jsx";
import CartPage from "@/pages/user/Cart.page";
import CheckoutPage from "@/pages/user/checkout/Checkout.page.jsx";
import ProfileLayout from "@/components/layout/ProfileLayout";

// Profile
import ProfileInfo from "@/pages/user/Profile/Info.jsx";
import OrdersPage from "@/pages/user/Profile/Orders.jsx";
import LikedPage from "@/pages/user/Profile/Liked.jsx";
import AddressesPage from "@/pages/user/Profile/Address.jsx";
//Kết thúc

import AdminLayout from "@/components/layout/AdminLayout";
import SlideshowManagerPage from "@/pages/slideshowManager";
import BlogListPage from "@/pages/user/BlogList.page.jsx";
import BlogDetailPage from "@/pages/user/BlogDetail.page.jsx";
import ContactPage from "@/pages/user/Contact.page.jsx";
import UnitManagerPage from "@/pages/unitManager";
import AddUnit from "@/pages/unitManager/AddUnit.jsx";
import EditUnit from "@/pages/unitManager/EditUnit";
import WarehouseManagerPage from "@/pages/warehouseManager";
import AddWarehouse from "@/pages/warehouseManager/AddWarehouse";
import EditWarehouse from "@/pages/warehouseManager/EditWarehouse";
import WarrantyTimeManagerPage from "@/pages/warrantyTimeManager";
import AddWarrantyTime from "@/pages/warrantyTimeManager/AddWarrantyTime";
import EditWarrantyTime from "@/pages/warrantyTimeManager/EditWarrantyTime";
import AddSlideshow from "@/pages/slideshowManager/AddSlideshow";
import EditSlideshow from "@/pages/slideshowManager/EditSlideshow";
import ContactManagerPage from "@/pages/contactManager";
import ContactEdit from "@/pages/contactManager/EditContact";
import ReviewManagerPage from "@/pages/reviewManager";
import BlogManagerPage from "@/pages/blogManager";
import AddBlog from "@/pages/blogManager/AddBlog";
import EditBlog from "@/pages/blogManager/EditBlog";
import CategoryManagerPage from "@/pages/categoryManager/index.jsx";
import AddCategoryPage from "@/pages/categoryManager/AddCategory.jsx";
import EditCategoryPage from "@/pages/categoryManager/EditCategory.jsx";

import { createBrowserRouter } from "react-router-dom";
import CreateImportWarehousePage from "@/pages/Admin/warehouse/import/create";
import CreateExportWarehousePage from "@/pages/Admin/warehouse/export/Create";
import UserManagerPage from "@/pages/userManager";
import ProductManagerPage from "@/pages/productManager";
import EmployeeManagerPage from "@/pages/employeeManager";
import AddUserPage from "@/pages/userManager/AddUser";
import EditUserPage from "@/pages/userManager/EditUser";
import AddProductPage from "@/pages/productManager/AddProduct";
import AttributeGroupPage from "@/pages/attribute_groupManager";


export const router = createBrowserRouter([
  {
    path: "/",
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
        path: "products/:id",
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
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <div>Admin Dashboard</div>,
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
        path: 'warehouse/import/create',
        element: <CreateImportWarehousePage />
      },
      {
        path: 'warehouse/export/create',
        element: <CreateExportWarehousePage />
      },
      {
        path: 'users',
        element: <UserManagerPage />,
      },
      {
        path: 'employees',
        element: <EmployeeManagerPage />,
      },
      {
        path: 'users/add',
        element: <AddUserPage />,
      },
      {
        path: 'users/edit/:id',
        element: <EditUserPage />,
      },
      {
        path: 'products/',
        element: <ProductManagerPage />,
      },
      {
        path: 'products/add',
        element: <AddProductPage />
      }
      // },
      // {
      //   path: 'products/edit/:id',
      //   element: <EditProductPage />
      // }
    ],
  },
]);