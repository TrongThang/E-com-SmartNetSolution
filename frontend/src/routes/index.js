import DefaultLayout from "@/components/layout/defaultLayout";
import HomePage from "@/pages/User/home/Home.page";
import SearchPage from "@/pages/User/Search.page";
import ProductDetailPage from "@/pages/User/ProductDetail.page";
import CartPage from "@/pages/User/Cart.page";
import CheckoutPage from "@/pages/User/checkout/Checkout.page";
import CreateExportWarehousePage from "@/pages/Admin/warehouse/export/Create";
import CreateImportWarehousePage from "@/pages/Admin/warehouse/import/create";
import { createBrowserRouter } from "react-router-dom";

import AdminLayout from '@/components/layout/AdminLayout';

import BlogListPage from '@/pages/User/BlogList.page';
import BlogDetailPage from '@/pages/User/BlogDetail.page';
import ContactPage from '@/pages/User/Contact.page';

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
import ReviewManagerPage from '@/pages/reviewManager';

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
      {
        path: 'reviews',
        element: <ReviewManagerPage />,
      },
    ],
  },
]);