import { Outlet } from "react-router-dom"
import ProfileSidebar from "@/pages/User/Profile/Profile-sidebar.jsx"

export default function ProfileLayout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="hidden md:block">
          <ProfileSidebar />
        </div>
        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
