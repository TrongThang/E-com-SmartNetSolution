import AdminLayout from '@/components/layout/adminLayout';
import DefaultLayout from '@/components/layout/defaultLayout';
import CategoriesPage from '@/pages/categoryManager';
import AttributeGroupPage from '@/pages/attribute_groupManager';
import CartPage from '@/pages/user/Cart.page.jsx';
import HomePage from '@/pages/user/home/Home.page';
import ProductDetailPage from '@/pages/user/ProductDetail.page.jsx';
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
]);