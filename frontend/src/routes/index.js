import AdminLayout from '@/components/layout/AdminLayout';
import DefaultLayout from '@/components/layout/defaultLayout';


import BlogListPage from '@/pages/User/BlogList.page';
import BlogDetailPage from '@/pages/User/BlogDetail.page';
import ContactPage from '@/pages/User/Contact.page';
import CategoriesPage from '@/pages/categoryManager';
import AttributeGroupPage from '@/pages/attribute_groupManager';
import CartPage from '@/pages/User/Cart.page';
import HomePage from '@/pages/User/home/Home.page';
import ProductDetailPage from '@/pages/User/ProductDetail.page';
import { createBrowserRouter } from 'react-router-dom';
import ProfilePage from '@/pages/profileManager/profile';
import EmployeeManagerPage from '@/pages/employeeManager';
import UnitManagerPage from '@/pages/unitManager';
import AddUnit from '@/pages/unitManager/AddUnit';
import EditUnit from '@/pages/unitManager/EditUnit';
import WarehouseManagerPage from '@/pages/warehouseManager';
import AddWarehouse from '@/pages/warehouseManager/AddWarehouse';
import EditWarehouse from '@/pages/warehouseManager/EditWarehouse';
import WarrantyTimeManagerPage from '@/pages/warrantyTimeManager';
import AddWarrantyTime from '@/pages/warrantyTimeManager/AddWarrantyTime';
import EditWarrantyTime from '@/pages/warrantyTimeManager/EditWarrantyTime';
import SlideshowManagerPage from '@/pages/slideshowManager';
import AddSlideshow from '@/pages/slideshowManager/AddSlideshow';
import EditSlideshow from '@/pages/slideshowManager/EditSlideshow';
import ContactManagerPage from '@/pages/contactManager';
import ContactEdit from '@/pages/contactManager/EditContact';
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
        path: 'attribute-groups',
        element: <AttributeGroupPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
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