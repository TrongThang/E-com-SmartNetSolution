import DefaultLayout from "@/components/layout/defaultLayout";
import HomePage from "@/pages/User/home/Home.page";
import SearchPage from "@/pages/User/Search.page";
import ProductDetailPage from "@/pages/User/ProductDetail.page";
import CartPage from "@/pages/User/Cart.page";
import CheckoutPage from "@/pages/User/checkout/Checkout.page";
import CreateExportWarehousePage from "@/pages/Admin/warehouse/export/Create";
import CreateImportWarehousePage from "@/pages/Admin/warehouse/import/Create";
import { createBrowserRouter } from "react-router-dom";


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
