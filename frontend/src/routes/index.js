import DefaultLayout from "@/components/layout/defaultLayout";
import HomePage from "@/pages/User/home/Home.page";
import SearchPage from "@/pages/User/Search.page";
import ProductDetailPage from "@/pages/User/ProductDetail.page";
import CartPage from "@/pages/User/Cart.page";
import CheckoutPage from "@/pages/User/checkout/Checkout.page";
import CreateExportWarehousePage from "@/pages/Admin/warehouse/export/Create";
import CreateImportWarehousePage from "@/pages/Admin/warehouse/import/create";
import ProfileLayout from "@/components/layout/ProfileLayout";
import ProfileInfo from "@/pages/User/Profile/Info";
import { createBrowserRouter } from "react-router-dom";
import OrdersPage from "@/pages/User/Profile/Orders";
import LikedPage from "@/pages/User/Profile/Liked";
import AddressesPage from "@/pages/User/Profile/Address";
import AdminLayout from "@/components/layout/AdminLayout";
import SlideshowManagerPage from "@/pages/slideshowManager";
import ProductManagerPage from "@/pages/productManager";
import AddProductPage from "@/pages/productManager/AddProduct";
import EditProductPage from "@/pages/productManager/EditProduct";


export const router = createBrowserRouter([
  {
    path: '/admin/',
    element: <AdminLayout />,
    children: [
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
    {
        path: 'slideshows',
        element:<SlideshowManagerPage />
    },
    {
        path: 'products/',
        element:<ProductManagerPage />,
    },
    {
        path: 'products/add',
        element: <AddProductPage />
    },
    {
        path: 'products/edit',
        element: <EditProductPage />
    }
    ],
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
            path: 'checkout',
            element: <CheckoutPage />,
          },
        ],
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
