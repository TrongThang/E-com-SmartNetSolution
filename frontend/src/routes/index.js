import AdminLayout from '@/components/layout/adminLayout';
import DefaultLayout from '@/components/layout/defaultLayout';
import BlogListPage from '@/pages/user/BlogList.page.jsx';
import BlogDetailPage from '@/pages/user/BlogDetail.page.jsx';
import ContactPage from '@/pages/user/Contact.page.jsx';
import CategoriesPage from '@/pages/categoryManager';
import AttributeGroupPage from '@/pages/attribute_groupManager';
import HomePage from '@/pages/user/home/Home.page';
import CreateExportWarehousePage from '@/pages/Admin/warehouse/export/Export.page';
import CreateImportWarehousePage from '@/pages/Admin/warehouse/import/create';
import CartPage from '@/pages/user/Cart.page.jsx';
import CheckoutPage from '@/pages/user/checkout/Checkout.page.jsx';
import CheckoutSuccessPage from '@/pages/user/checkout/success/CheckoutSuccess.page.jsx';
import ProductDetailPage from '@/pages/user/ProductDetail.page.jsx';
import SearchPage from '@/pages/user/Search.page.jsx';
import { createBrowserRouter } from 'react-router-dom';
import ProfilePage from '@/pages/profileManager/profile';
import EmployeeManagerPage from '@/pages/employeeManager';
import AddCategoryPage from '@/pages/categoryManager/AddCategory';
import { createBrowserRouter } from "react-router-dom";


export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        children: [
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
          }
        ],
      },
      {
        path: '/warehouse/export/create',
        element: <CreateExportWarehousePage />,
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
        path: 'employees',
        element: <EmployeeManagerPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'categories/create',
        element: <AddCategoryPage />,
      },
      {
        path: 'attribute-groups',
        element: <AttributeGroupPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);
