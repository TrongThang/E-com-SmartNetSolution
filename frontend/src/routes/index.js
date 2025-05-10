import DefaultLayout from '@/components/layout/defaultLayout';
import CartPage from '@/pages/User/Cart.page';
import ProductDetailPage from '@/pages/User/ProductDetail.page';
import BlogListPage from '@/pages/User/BlogList.page';
import BlogDetailPage from '@/pages/User/BlogDetail.page';
import { createBrowserRouter } from 'react-router-dom';
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
            // {
            //   path: 'checkout',
            //   element: <Checkout />,
            // },
        ],
    },
]);