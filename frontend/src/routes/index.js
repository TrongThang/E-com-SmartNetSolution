import DefaultLayout from "@/components/layout/defaultLayout";
import HomePage from "@/pages/User/home/Home.page";
import SearchPage from "@/pages/User/Search.page";
import ProductDetailPage from "@/pages/User/ProductDetail.page";
import CartPage from "@/pages/User/Cart.page";
import CheckoutPage from "@/pages/User/checkout/Checkout.page";
import ProfileLayout from "@/components/layout/ProfileLayout";
import ProfileInfo from "@/pages/User/Profile/Info";
import { createBrowserRouter } from "react-router-dom";
import OrdersPage from "@/pages/User/Profile/Orders";
import LikedPage from "@/pages/User/Profile/Liked";
import AddressesPage from "@/pages/User/Profile/Address";
import AdminLayout from "@/components/layout/AdminLayout";
import SlideshowManagerPage from "@/pages/slideshowManager";

import BlogListPage from '@/pages/User/BlogList.page';
import BlogDetailPage from '@/pages/User/BlogDetail.page';
import ContactPage from '@/pages/User/Contact.page';

import UnitManagerPage from '@/pages/unitManager';
import AddUnit from '@/pages/unitManager/AddUnit';
import EditUnit from '@/pages/unitManager/EditUnit';
import WarehouseManagerPage from '@/pages/warehouseManager';
import AddWarehouse from '@/pages/warehouseManager/AddWarehouse';
import EditWarehouse from '@/pages/warehouseManager/EditWarehouse';
import WarrantyTimeManagerPage from '@/pages/warrantyTimeManager';
import AddWarrantyTime from '@/pages/warrantyTimeManager/AddWarrantyTime';
import EditWarrantyTime from '@/pages/warrantyTimeManager/EditWarrantyTime';
import AddSlideshow from '@/pages/slideshowManager/AddSlideshow';
import EditSlideshow from '@/pages/slideshowManager/EditSlideshow';
import ContactManagerPage from '@/pages/contactManager';
import ContactEdit from '@/pages/contactManager/EditContact';
import ReviewManagerPage from '@/pages/reviewManager';
import BlogManagerPage from '@/pages/blogManager';
import AddBlog from '@/pages/blogManager/AddBlog';
import EditBlog from '@/pages/blogManager/EditBlog';
import CreateImportWarehousePage from "@/pages/Admin/warehouse/import/create";
import CreateExportWarehousePage from "@/pages/Admin/warehouse/export/Create";
import UserManagerPage from "@/pages/userManager";
import AddUserPage from "@/pages/userManager/AddUser";
import EditUserPage from "@/pages/userManager/EditUser";
import ProductManagerPage from "@/pages/productManager";
import AddProductPage from "@/pages/productManager/AddProduct";
import EditProductPage from "@/pages/productManager/EditProduct";
import EmployeeManagerPage from "@/pages/employeeManager";
import StageExamples from "@/components/common/stage/state-example";
import TemplateManagement from "@/components/common/_test/template-management";

export const router = createBrowserRouter([
  {
    path: '/test-template',
    element: <TemplateManagement />
  },
  {
    path: '/test-stage',
    element: <StageExamples />
  },
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'profile/',
        element: <ProfileLayout />,
        children: [
            {
                path: 'info',
                element: <ProfileInfo />
            },
            {
                path: 'orders',
                element: <OrdersPage />
            },
            {
                path: 'liked',
                element: <LikedPage />
            },
            {
                path: 'addresses',
                element: <AddressesPage />
            },
            {
                path: 'change-password',
                element: <h1>Thay đổi mật khẩu</h1>
            }
        ]
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'blog',
        element: <BlogListPage />,
      },
      {
        path: 'blog/:id',
        element: <BlogDetailPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
      },
      {
        path: 'units',
        element: <UnitManagerPage />,
      },
      {
        path: 'units/add',
        element: <AddUnit />,
      },
      {
        path: 'units/edit/:id',
        element: <EditUnit />,
      },
      {
        path: 'warehouses',
        element: <WarehouseManagerPage />,
      },
      {
        path: 'warehouses/add',
        element: <AddWarehouse />,
      },
      {
        path: 'warehouses/edit/:id',
        element: <EditWarehouse />,
      },
      {
        path: 'warranty-times',
        element: <WarrantyTimeManagerPage />,
      },
      {
        path: 'warranty-times/add',
        element: <AddWarrantyTime />,
      },
      {
        path: 'warranty-times/edit/:id',
        element: <EditWarrantyTime />,
      },
      {
        path: 'slideshows',
        element: <SlideshowManagerPage />,
      },
      {
        path: 'slideshows/add',
        element: <AddSlideshow />,
      },
      {
        path: 'slideshows/edit/:id',
        element: <EditSlideshow />,
      },
      {
        path: 'contacts',
        element: <ContactManagerPage />,
      },
      {
        path: 'contacts/edit/:id',
        element: <ContactEdit />,
      },
      {
        path: 'reviews',
        element: <ReviewManagerPage />,
      },
      {
        path: 'blogs',
        element: <BlogManagerPage />,
      },
      {
        path: 'blogs/add',
        element: <AddBlog />,
      },
      {
        path: 'blogs/edit/:id',
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
      },
      {
        path: 'products/edit/:id',
        element: <EditProductPage />
      }
    ],
  },
]);
