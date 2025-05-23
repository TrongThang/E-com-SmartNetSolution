"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, ChevronDown, Menu } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useNavigate } from "react-router-dom"
import { formatCurrency } from "@/utils/format"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import LoginModal from "@/components/common/AuthModal"
import categoryApi from "@/apis/modules/categories.api.ts"

export default function Navbar() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const { totalItems, totalAmount } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...")
      const res = await categoryApi.list({})
      console.log("Category API response:", res)
      if (res.status_code === 200) {
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
      navigate(`/search?keyword=${encodeURIComponent(searchValue.trim())}`)
      setIsMobileMenuOpen(false) // Close mobile menu after search
    }
  }

  const buildCategoryTree = (categories) => {
    const categoryMap = {}
    const rootCategories = []

    categories.forEach((category) => {
      categoryMap[category.category_id] = {
        ...category,
        children: category.children || []
      }
    })

    categories.forEach((category) => {
      if (category.parent_id && categoryMap[category.parent_id]) {
        categoryMap[category.parent_id].children.push(categoryMap[category.category_id])
      } else {
        rootCategories.push(categoryMap[category.category_id])
      }
    })

    return rootCategories
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    fetchCategories()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2 bg-white shadow-md" : "py-4 bg-white/95 backdrop-blur-sm"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-500">INQ Shop</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-sm font-medium hover:text-blue-500 transition-colors relative group py-2">
              Trang chủ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="relative group">
              <Link
                to="#"
                className="text-sm font-medium hover:text-blue-500 transition-colors flex items-center gap-1 py-2"
              >
                Danh mục
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Link>
              <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg hidden group-hover:block transition-all z-50 w-[800px] max-w-[90vw]">
                <div className="flex">
                  <div className="w-1/3 bg-blue-50/70 max-h-[450px] overflow-y-auto">
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category, index) => (
                        <div
                          key={category.category_id}
                          className={`category-item transition-all duration-200 ${index === 0 ? "bg-blue-100 text-blue-700 border-r-4 border-blue-500" : ""}`}
                          data-category-id={category.category_id}
                          onMouseEnter={(e) => {
                            document
                              .querySelectorAll(".category-item")
                              .forEach((item) => item.classList.remove("bg-blue-100", "text-blue-700", "border-r-4", "border-blue-500"))
                            e.currentTarget.classList.add("bg-blue-100", "text-blue-700", "border-r-4", "border-blue-500")
                            document
                              .querySelectorAll(".subcategory-panel")
                              .forEach((panel) => panel.classList.add("hidden"))
                            document
                              .querySelector(`.subcategory-panel[data-category-id="${category.category_id}"]`)
                              ?.classList.remove("hidden")
                          }}
                        >
                          <Link
                            to={`/search?category=${category.category_id}`}
                            className="flex items-center justify-between px-4 py-3 text-sm w-full transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="font-medium">{category.name}</span>
                            {category.children && category.children.length > 0 && (
                              <ChevronDown className="h-4 w-4 opacity-70 -rotate-90" />
                            )}
                          </Link>
                        </div>
                      ))
                    ) : (
                      <span className="block px-4 py-3 text-sm text-slate-500">Không có danh mục</span>
                    )}
                  </div>
                  <div className="w-2/3 p-4 max-h-[450px] overflow-y-auto">
                    {Array.isArray(categories) && categories.length > 0
                      ? categories.map((category, index) => (
                        <div
                          key={category.category_id}
                          className={`subcategory-panel ${index === 0 ? "" : "hidden"}`}
                          data-category-id={category.category_id}
                        >
                          <div className="mb-4 pb-2 border-b border-gray-100">
                            <Link
                              to={`/search?category=${category.category_id}`}
                              className="text-blue-600 font-medium text-base hover:text-blue-700 flex items-center"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {category.name}
                              <ChevronDown className="h-4 w-4 ml-1 -rotate-90" />
                            </Link>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {category.description || `Khám phá tất cả sản phẩm trong danh mục ${category.name}`}
                            </p>
                          </div>
                          {category.children && category.children.length > 0 ? (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                              {category.children.map((subCategory) => (
                                <div key={subCategory.category_id} className="mb-2">
                                  <Link
                                    to={`/search?category=${subCategory.category_id}`}
                                    className="text-sm font-medium text-gray-800 hover:text-blue-600 block mb-2 flex items-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {subCategory.name}
                                    {subCategory.children && subCategory.children.length > 0 && (
                                      <ChevronDown className="h-3 w-3 ml-1 opacity-70 -rotate-90" />
                                    )}
                                  </Link>
                                  {subCategory.children && subCategory.children.length > 0 && (
                                    <ul className="space-y-1 border-l-2 border-gray-100 pl-2">
                                      {subCategory.children.slice(0, 4).map((thirdLevelCategory) => (
                                        <li key={thirdLevelCategory.category_id}>
                                          <Link
                                            to={`/search?category=${thirdLevelCategory.category_id}`}
                                            className="text-xs text-gray-600 hover:text-blue-600 block py-1"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                          >
                                            {thirdLevelCategory.name}
                                          </Link>
                                        </li>
                                      ))}
                                      {subCategory.children.length > 4 && (
                                        <li>
                                          <Link
                                            to={`/search?category=${subCategory.category_id}`}
                                            className="text-xs text-blue-500 hover:text-blue-700 block py-1"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                          >
                                            + {subCategory.children.length - 4} danh mục khác
                                          </Link>
                                        </li>
                                      )}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Không có danh mục con</p>
                          )}
                        </div>
                      ))
                      : null}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="text-xs font-medium text-gray-500">Danh mục nổi bật:</span>
                      <div className="flex gap-2">
                        {Array.isArray(categories) && categories.length > 0
                          ? categories.slice(0, 3).map((category) => (
                            <Link
                              key={category.category_id}
                              to={`/search?category=${category.category_id}`}
                              className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {category.name}
                            </Link>
                          ))
                          : null}
                      </div>
                    </div>
                    <Link to="/categories" className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                      Xem tất cả danh mục
                      <ChevronDown className="h-3 w-3 ml-1 -rotate-90" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/blog" className="text-sm font-medium hover:text-blue-500 transition-colors relative group py-2">
              Tin Tức
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-blue-500 transition-colors relative group py-2">
              Liên hệ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:flex items-center relative">
              <Input
                className="w-full border rounded-md p-2 pl-8 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch()
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
            <Link
              to="/cart"
              className="relative flex items-center h-10 px-3 rounded-full border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-slate-600" />
              <span className="ml-2 font-medium text-sm text-blue-500 hidden sm:inline">
                {formatCurrency(totalAmount)}
              </span>
              {totalItems > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
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

        <div className="mt-2 md:hidden">
          <div className="relative">
            <Input
              className="w-full border-slate-200 rounded-full pl-10 pr-4 py-2 focus-visible:ring-blue-500 text-sm"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch()
              }}
            />
            <Button
              type="button"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-8 rounded-l-none"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
              <div className="space-y-2">
                <div className="px-4 py-2 text-slate-700 font-medium flex items-center justify-between">
                  <span>Danh mục</span>
                  <Link
                    to="/categories"
                    className="text-xs text-blue-500 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Xem tất cả
                  </Link>
                </div>
                {Array.isArray(categories) && categories.length > 0 ? (
                  <div className="pl-4 space-y-2 max-h-[300px] overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.category_id} className="space-y-1">
                        <Link
                          to={`/search?category=${category.category_id}`}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-500 rounded-md font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <div className="pl-4 space-y-1 border-l-2 border-gray-100 ml-4">
                            {category.children.slice(0, 3).map((subCategory) => (
                              <Link
                                key={subCategory.category_id}
                                to={`/search?category=${subCategory.category_id}`}
                                className="block px-4 py-1.5 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subCategory.name}
                              </Link>
                            ))}
                            {category.children.length > 3 && (
                              <Link
                                to={`/search?category=${category.category_id}`}
                                className="block px-4 py-1 text-xs text-blue-500 hover:text-blue-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                + {category.children.length - 3} danh mục khác
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="block px-4 py-2 text-sm text-slate-500">Không có danh mục</span>
                )}
              </div>
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
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  )
}