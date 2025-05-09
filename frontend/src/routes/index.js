import AdminLayout from '@/components/layout/adminLayout';
import DefaultLayout from '@/components/layout/defaultLayout';
import CartPage from '@/pages/user/Cart.page.jsx';
import ProductDetailPage from '@/pages/user/ProductDetail.page.jsx';
import { createBrowserRouter } from 'react-router-dom';
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
          }
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
            // {
            //   path: 'checkout',
            //   element: <Checkout />,
            // },
        ],
    },
]);