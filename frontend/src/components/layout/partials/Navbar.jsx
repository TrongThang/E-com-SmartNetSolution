"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, ChevronDown, Menu } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { formatCurrency } from "@/utils/format"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import LoginModal from "@/components/common/AuthModal"

export default function Navbar() {
    const { totalItems, totalAmount } = useCart()
    const { isAuthenticated, user, logout } = useAuth()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Detect scroll for sticky header effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2 bg-white shadow-md" : "py-4 bg-white/95 backdrop-blur-sm"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="text-xl font-bold text-blue-500">INQ Shop</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-10">
                        <Link
                            to="/"
                            className="text-sm font-medium hover:text-blue-500 transition-colors relative group py-2"
                        >
                            Trang chủ
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <div className="relative group">
                            <Link
                                to="/categories"
                                className="text-sm font-medium hover:text-blue-500 transition-colors flex items-center gap-1 py-2"
                            >
                                Danh mục
                                <ChevronDown className="h-4 w-4 opacity-70" />
                            </Link>
                            <div className="absolute top-full left-0 bg-white shadow-lg rounded-md p-2 min-w-[200px] hidden group-hover:block transition-all">
                                <Link
                                    to="/categories/dien-thoai"
                                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                >
                                    Điện thoại
                                </Link>
                                <Link
                                    to="/categories/laptop"
                                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                >
                                    Laptop
                                </Link>
                                <Link
                                    to="/categories/tablet"
                                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                >
                                    Máy tính bảng
                                </Link>
                                <Link
                                    to="/categories/phu-kien"
                                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                >
                                    Phụ kiện
                                </Link>
                            </div>
                        </div>
                        <Link
                            to="/about"
                            className="text-sm font-medium hover:text-blue-500 transition-colors relative group py-2"
                        >
                            Giới thiệu
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                            to="/contact"
                            className="text-sm font-medium hover:text-blue-500 transition-colors relative group py-2"
                        >
                            Liên hệ
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </nav>

                    {/* Right side actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Search */}
                        <div className="hidden md:flex items-center relative">
                            <Input
                                className="w-[200px] lg:w-[250px] border-slate-200 rounded-full pl-10 pr-4 py-2 focus-visible:ring-blue-500 text-sm"
                                placeholder="Tìm kiếm sản phẩm..."
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                        </div>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative flex items-center h-10 px-3 rounded-full border 
                            border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                        >
                            <ShoppingCart className="h-5 w-5 text-slate-600" />
                            <span className="ml-2 font-medium text-sm text-blue-500 hidden sm:inline">{formatCurrency(totalAmount)}</span>
                            {totalItems > 0 && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white 
                                text-xs rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User Authentication */}
                        {isAuthenticated ? (
                            <div className="relative group">
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 text-slate-700 hover:text-blue-500 hover:bg-blue-50"
                                >
                                    <User className="h-5 w-5" />
                                    <span className="hidden sm:inline text-sm font-medium">{user?.username}</span>
                                    <ChevronDown className="h-4 w-4 opacity-70" />
                                </Button>
                                <div className="absolute top-full right-0 bg-white shadow-lg rounded-md p-2 min-w-[180px] hidden group-hover:block">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                    >
                                        Tài khoản của tôi
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                    >
                                        Đơn hàng
                                    </Link>
                                    <hr className="my-1 border-slate-200" />
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Button onClick={() => setIsLoginModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                                Đăng nhập
                            </Button>
                        )}

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Search - shown below header on mobile */}
                <div className="mt-2 md:hidden">
                    <div className="relative">
                        <Input
                            className="w-full border-slate-200 rounded-full pl-10 pr-4 py-2 focus-visible:ring-blue-500 text-sm"
                            placeholder="Tìm kiếm sản phẩm..."
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-2 bg-white rounded-lg shadow-lg p-4 border border-slate-100 animate-in fade-in duration-200">
                        <nav className="flex flex-col space-y-3">
                            <Link
                                to="/"
                                className="px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Trang chủ
                            </Link>
                            <Link
                                to="/categories"
                                className="px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Danh mục
                            </Link>
                            <Link
                                to="/about"
                                className="px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Giới thiệu
                            </Link>
                            <Link
                                to="/contact"
                                className="px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Liên hệ
                            </Link>
                        </nav>
                    </div>
                )}
            </div>

            {/* Login Modal */}
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </header>
    )
}
