import EcommerceSildebar from "./partials/EcommerceSidebar";
import Topbar from "./partials/Topbar";
import { Outlet } from "react-router-dom";
const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-full fixed top-0 left-0 z-30">
        <Topbar />
      </div>
      <div className="z-40">
        <EcommerceSildebar />
      </div>
      <div className="flex-1 flex flex-col">
        {/* chỉnh sửa giao diện bên trong */}
        <main className="mt-20 flex-1 p-6"
          style={{
            marginLeft: "200px"
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;