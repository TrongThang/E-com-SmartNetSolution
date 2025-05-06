import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"

export default function Navbar() {
    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
            <div className="flex items-center space-x-4">
                <span className="text-xl font-bold text-blue-600">INQ Shop</span>
                <nav className="space-x-4">
                    <a href="#" className="text-[var(--primary)] hover:text-[var(--primary)]">Trang chủ</a>
                    <a href="#" className="text-[var(--neutral)] hover:text-[var(--primary)]">Danh mục</a>
                    <a href="#" className="text-[var(--neutral)] hover:text-[var(--primary)]">Giới thiệu</a>
                    <a href="#" className="text-[var(--neutral)] hover:text-[var(--primary)]">Liên hệ</a>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex max-w-sm items-center relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full border rounded-md p-2 pl-8 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <Button type="submit" size="icon" className="absolute right-0 h-full rounded-l-none">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                <div className="border border-gray-300 rounded-full whitespace-nowrap">
                    <span className="pl-2 pr-2 text-red-600 font-bold">41,200,000,000 VNĐ</span>
                    <button className="p-4 bg-blue-600 text-white rounded-e-full hover:bg-blue-700">
                        <i class="fa-solid fa-cart-shopping text-lg"></i>
                    </button>
                </div>
            </div>
        </header>
    );
};