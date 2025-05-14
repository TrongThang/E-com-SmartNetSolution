import AdminLayout from '@/components/layout/adminLayout';
import DefaultLayout from '@/components/layout/defaultLayout';
import BlogListPage from '@/pages/user/BlogList.page.jsx';
import BlogDetailPage from '@/pages/user/BlogDetail.page.jsx';
import ContactPage from '@/pages/user/Contact.page.jsx';
import CategoriesPage from '@/pages/categoryManager';
import AttributeGroupPage from '@/pages/attribute_groupManager';
import HomePage from '@/pages/user/home/Home.page';
import ProductDetailPage from '@/pages/user/ProductDetail.page.jsx';
import CreateExportWarehousePage from '@/pages/Admin/warehouse/export/Export.page';
import CreateImportWarehousePage from '@/pages/Admin/warehouse/import/create';
import CartPage from '@/pages/User/Cart.page';
import CheckoutPage from '@/pages/User/checkout/Checkout.page';
import CheckoutSuccessPage from '@/pages/User/checkout/success/CheckoutSuccess.page';
import ProductDetailPage from '@/pages/User/ProductDetail.page';
import SearchPage from '@/pages/User/Serach.page';
import { createBrowserRouter } from 'react-router-dom';
import ProfilePage from '@/pages/profileManager/profile';
import EmployeeManagerPage from '@/pages/employeeManager';
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
<<<<<<< HEAD
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
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // {
      //   path: 'search',
      //   element: <SearchProductPage />,
      // },
      {
        path: 'products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      // {
      //   path: 'checkout',
      //   element: <Checkout />,
      // },
    ],
  },
=======
                path: 'checkout',
                element: <CheckoutPage />,
            },
            {
                path: 'checkout/success',
                element: <CheckoutSuccessPage />,
            }
        ],
    },
    {
        path: '/warehouse/export/create',
        element: <CreateExportWarehousePage />,
    },
    {
        path: '/warehouse/import/create',
        element: <CreateImportWarehousePage />,
    },
>>>>>>> 8a36140121868a233e2b3e9631afaeb870e35647
]);