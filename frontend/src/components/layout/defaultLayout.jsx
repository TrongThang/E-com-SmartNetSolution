import { Outlet } from "react-router-dom";
import Navbar from "./partials/Navbar";
import Footer from "./partials/Footer";

export default function DefaultLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};