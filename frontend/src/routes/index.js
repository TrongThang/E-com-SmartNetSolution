import AdminLayout from '@/components/layout/AdminLayout';
import DefaultLayout from '@/components/layout/defaultLayout';
import BlogListPage from '@/pages/user/BlogList.page.jsx';
import BlogDetailPage from '@/pages/user/BlogDetail.page.jsx';
import ContactPage from '@/pages/user/Contact.page.jsx';
import CategoriesPage from '@/pages/categoryManager';
import AttributeGroupPage from '@/pages/attribute_groupManager';
import HomePage from '@/pages/user/home/Home.page';
import CreateExportWarehousePage from '@/pages/Admin/warehouse/export/Export.page';
import CreateImportWarehousePage from '@/pages/Admin/warehouse/import/create';
import CartPage from '@/pages/User/Cart.page';
import CheckoutPage from '@/pages/User/checkout/Checkout.page';
import CheckoutSuccessPage from '@/pages/User/checkout/success/CheckoutSuccess';
import ProductDetailPage from '@/pages/User/ProductDetail.page';
import SearchPage from '@/pages/User/Serach.page';
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
import ProfileLayout from '@/components/layout/ProfileLayout';
import ProfileInfo from '@/pages/User/Profile/Info';
import AddressesPage from '@/pages/User/Profile/Address';
import OrdersPage from '@/pages/User/Profile/Orders';
import LikedPage from '@/pages/User/Profile/Liked';
// import AdminLayout from '../layouts/AdminLayout';
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
            path: 'profile',
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
                path: 'addresses',
                element: <AddressesPage />
              },
              {
                path: 'liked',
                element: <LikedPage />
              },
              {
                path: 'change-password',
                element: <div>Đổi mật khẩu</div>
              }
            ]
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
        path: '/warehouse/import/create',
        element: <CreateImportWarehousePage />,
      }
    ]
  }
]);
