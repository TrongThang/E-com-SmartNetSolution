import Navbar from "./partials/Navbar";

export default function DefaultLayout() {
    return (
        <div className="flex h-screen">
            {/* <Sidebar /> */}
            <div className="flex-1 flex flex-col">
                <Navbar />
                {/* <Outlet /> */}
            </div>
        </div>
    );
};