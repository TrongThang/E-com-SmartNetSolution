import React from 'react';
import { Outlet } from "react-router-dom";
import Navbar_admin from "./partials/Navbar_admin";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar_admin />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>  
  );
};

export default AdminLayout;
