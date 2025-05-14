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
import categoryApi from "@/apis/modules/categories.api.ts"

export default function Navbar() {
    const [categories, setCategories] = useState([])
    const { totalItems, totalAmount } = useCart()
    const { isAuthenticated, user, logout } = useAuth()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const fetchCategories = async () => {
        try {
            console.log("Đang fetch categories...")
            const res = await categoryApi.list({})
            console.log("Response:", res)
            if (res.status_code == 200) {
                // Giả sử API trả về danh mục phẳng, chúng ta cần chuyển đổi thành cấu trúc cây
                const categoriesData = res.data?.categories || []
                const nestedCategories = buildCategoryTree(categoriesData)
                setCategories(nestedCategories)
            }
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    const handleSearch = () => {
        if (searchValue.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchValue.trim())}`);
        }
    };
    // Hàm xây dựng cây danh mục từ danh sách phẳng
    const buildCategoryTree = (categories) => {
        const categoryMap = {}
        const rootCategories = []

        // Tạo map các danh mục theo ID
        categories.forEach((category) => {
            categoryMap[category.category_id] = {
                ...category,
                children: [],
            }
        })

        // Xây dựng cây
        categories.forEach((category) => {
            if (category.parent_id) {
                // Nếu có parent_id, thêm vào danh sách con của parent
                if (categoryMap[category.parent_id]) {
                    categoryMap[category.parent_id].children.push(categoryMap[category.category_id])
                }
            } else {
                // Nếu không có parent_id, đây là danh mục gốc
                rootCategories.push(categoryMap[category.category_id])
            }
        })

        return rootCategories
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        window.addEventListener("scroll", handleScroll)

        fetchCategories()

        console.log("Categories:", categories)

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
                        <Link to="/" className="text-sm font-medium hover:text-blue-500 transition-colors relative group py-2">
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
                                {Array.isArray(categories) && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <div key={category.category_id} className="relative group/subcategory">
                                            <Link
                                                to={`/categories/${category.slug}`}
                                                className="flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md w-full"
                                            >
                                                <span>{category.name}</span>
                                                {category.children && category.children.length > 0 && (
                                                    <ChevronDown className="h-4 w-4 opacity-70 -rotate-90" />
                                                )}
                                            </Link>
                                            {category.children && category.children.length > 0 && (
                                                <div className="absolute top-0 left-full bg-white shadow-lg rounded-md p-2 min-w-[200px] hidden group-hover/subcategory:block ml-1">
                                                    {category.children.map((subCategory) => (
                                                        <div key={subCategory.category_id} className="relative group/subsubcategory">
                                                            <Link
                                                                to={`/categories/${category.slug}/${subCategory.slug}`}
                                                                className="flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md w-full"
                                                            >
                                                                <span>{subCategory.name}</span>
                                                                {subCategory.children && subCategory.children.length > 0 && (
                                                                    <ChevronDown className="h-4 w-4 opacity-70 -rotate-90" />
                                                                )}
                                                            </Link>
                                                            {subCategory.children && subCategory.children.length > 0 && (
                                                                <div className="absolute top-0 left-full bg-white shadow-lg rounded-md p-2 min-w-[200px] hidden group-hover/subsubcategory:block ml-1">
                                                                    {subCategory.children.map((thirdLevelCategory) => (
                                                                        <Link
                                                                            key={thirdLevelCategory.category_id}
                                                                            to={`/categories/${category.slug}/${subCategory.slug}/${thirdLevelCategory.slug}`}
                                                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                                                        >
                                                                            {thirdLevelCategory.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <span className="block px-4 py-2 text-sm text-slate-500">Không có danh mục</span>
                                )}
                            </div>
                        </div>

                        <Link to="/blog" className="text-sm font-medium hover:text-blue-500 transition-colors relative group py-2">
                            Tin Tức
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

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative flex items-center h-10 px-3 rounded-full border 
                            border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                        >
                            <ShoppingCart className="h-5 w-5 text-slate-600" />
                            <span className="ml-2 font-medium text-sm text-blue-500 hidden sm:inline">
                                {formatCurrency(totalAmount)}
                            </span>
                            {totalItems > 0 && (
                                <span
                                    className="absolute top-2 right-2 bg-red-500 text-white 
                                text-xs rounded-full flex items-center justify-center"
                                >
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
