import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, ShoppingBag, LogOut } from "lucide-react"
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/utils/format";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/common/AuthModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const { totalItems, totalAmount } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchValue.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchValue.trim())}`);
        }
    };

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
            <div className="flex items-center space-x-4">
                <span className="text-xl font-bold text-blue-600">INQ Shop</span>
                <nav className="space-x-4">
                    <Link to="/" className="text-[var(--primary)] hover:text-[var(--primary)]">Trang chủ</Link>
                    <Link to="/categories" className="text-[var(--neutral)] hover:text-[var(--primary)]">Danh mục</Link>
                    <Link to="/about" className="text-[var(--neutral)] hover:text-[var(--primary)]">Giới thiệu</Link>
                    <Link to="/contact" className="text-[var(--neutral)] hover:text-[var(--primary)]">Liên hệ</Link>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex max-w-sm items-center relative">
                    <Input
                        className="w-full border rounded-md p-2 pl-8 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Tìm kiếm..."
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                    <Button
                        type="button"
                        size="icon"
                        className="absolute right-0 h-full rounded-l-none"
                        onClick={handleSearch}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                <Link to="/cart" className="cursor-pointer">
                    <div className="border border-gray-300 rounded-full whitespace-nowrap">
                        <span className="pl-2 pr-2 text-red-600 font-bold">{formatCurrency(totalAmount)}</span>
                        <button className="relative p-4 bg-blue-600 text-white rounded-e-full hover:bg-blue-700">
                            <i className="fa-solid fa-cart-shopping text-lg"></i>
                            <span className="absolute -top-0 -right-1 bg-red-500 text-white text-sm font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        </button>
                    </div>
                </Link>
                {isAuthenticated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48 bg-white shadow-lg border rounded-lg"
                        >
                            <DropdownMenuLabel className="font-normal">
                                Xin chào,<br />
                                <span className="font-semibold">{user?.username}</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to="/profile" className="flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    Hồ sơ
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/orders" className="flex items-center">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Đơn hàng
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={logout}
                                className="text-red-600 focus:bg-red-50 focus:text-red-700"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button
                        onClick={() => setIsLoginModalOpen(true)}
                    >
                        Đăng nhập
                    </Button>
                )}
            </div>
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </header>
    );
};