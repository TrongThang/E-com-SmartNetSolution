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
// import ShopLayout from '../layouts/ShopLayout';
// import AdminDashboard from '../pages/admin/Dashboard';
// import AdminProducts from '../pages/admin/Products';
// import AdminOrders from '../pages/admin/Orders';
// import Home from '../pages/shop/Home';
// import ShopProducts from '../pages/shop/Products';
// import Cart from '../pages/shop/Cart';
// import Checkout from '../pages/shop/Checkout';

export const router = createBrowserRouter([
  {
    // path: '/admin',
    // element: <AdminLayout />,
    // children: [
    //   {
    //     index: true,
    //     element: <AdminDashboard />,
    //   },
    //   {
    //     path: 'products',
    //     element: <AdminProducts />,
    //   },
    //   {
    //     path: 'orders',
    //     element: <AdminOrders />,
    //   },
    // ],
  },
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      // {
      //   index: true,
      //   element: <Home />,
      // },
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
      // {
      //   path: 'checkout',
      //   element: <Checkout />,
      // },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        // element: <AdminCategory />,
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

      //   },
      //   {
      //     path: 'products',
      //     element: <AdminProducts />,
      //   },
      //   {
      //     path: 'orders',
      //     element: <AdminOrders />,
      //   },
    ],
  },
]);