import Topbar from "./partials/Topbar";
import { Navigate, Outlet } from "react-router-dom";
import EcommerceSidebar from "./partials/EcommerceSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";



const AdminLayout = () => {
	const { isAdminAuthenticated } = useAuth()
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		console.log('isAdminAuthenticated',isAdminAuthenticated)
		if (isAdminAuthenticated) {
			setIsLoading(false)
		}
	}, [isAdminAuthenticated])

	if (!isAdminAuthenticated) {
		return <Navigate to="/admin/login" />
	}
	
	return (
		<div className="flex min-h-screen">
			<div className="w-full fixed top-0 left-0 z-30">
				<Topbar />
			</div>
			<div className="z-40">
				<EcommerceSidebar />
			</div>
			<div className="flex-1 flex flex-col">
				{/* chỉnh sửa giao diện bên trong */}
				<main className="mt-20 flex-1 p-6 ml-[14vw] mt-[10vh]">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;