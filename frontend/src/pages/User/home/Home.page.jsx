import { Link } from "react-router-dom"
import { ChevronRight, Star } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DeviceCard from "./DeviceCard.page.jsx"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-blue-50">
      <main className="flex-1">
        {/* Hero Banner Section - Full Width */}
        <section className="w-full">
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
            <img
              src="/placeholder.svg?height=600&width=1920"
              alt="Khuyến mãi đặc biệt"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-r from-blue-900/90 to-blue-700/80 p-6 md:p-12">
              <div className="mx-auto w-full max-w-5xl">
                <Badge className="mb-4 bg-blue-500 text-white px-3 py-1 text-sm">Khuyến mãi mùa hè</Badge>
                <h2 className="mb-3 text-3xl font-bold md:text-5xl lg:text-6xl text-white">Ecomic-smartNet</h2>
                <p className="mb-6 max-w-md text-lg md:text-xl text-white/90">
                  Giải pháp công nghệ thông minh cho cuộc sống hiện đại
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium" size="lg">
                    Khám phá ngay
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                    size="lg"
                  >
                    Xem khuyến mãi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Danh mục sản phẩm</h2>
              <Link to="#" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                Xem tất cả <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.map((category, index) => (
                <Link to="#" key={index} className="group">
                  <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-100 hover:scale-105">
                    <div className="mb-3 rounded-full bg-blue-50 p-4">
                      <img
                        src={`/placeholder.svg?height=48&width=48&text=${category.name}`}
                        alt={category.name}
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <span className="text-center text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Banner Promotion */}
        <section className="py-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Giảm giá đến 30%</h2>
                <p className="text-white/90">Cho tất cả sản phẩm Apple trong tháng 5</p>
              </div>
              <Button className="bg-white hover:bg-gray-100 text-blue-700" size="lg">
                Mua ngay
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-12 bg-blue-50">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Thiết bị nổi bật</h2>
              <Link to="#" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                Xem tất cả <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {featuredProducts.map((product, index) => (
                <DeviceCard key={index} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* New Devices Section */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Thiết bị mới</h2>
              <Link to="#" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                Xem tất cả <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {newArrivals.map((product, index) => (
                <DeviceCard key={index} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-10 bg-blue-50">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Thương hiệu nổi bật</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {brands.map((brand, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <img
                    src={`/placeholder.svg?height=60&width=120&text=${brand}`}
                    alt={brand}
                    className="h-12 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background w-full">
        <div className="w-full bg-gray-900 text-white py-12">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="md:col-span-1">
                <h3 className="mb-4 text-lg font-bold">Ecomic-smartNet</h3>
                <p className="mb-4 text-sm text-gray-300">
                  Cửa hàng chuyên cung cấp các sản phẩm công nghệ chính hãng với giá tốt nhất thị trường.
                </p>
                <div className="flex items-center gap-4">
                  <Link to="#" className="text-gray-300 hover:text-blue-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </Link>
                  <Link to="#" className="text-gray-300 hover:text-blue-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </Link>
                  <Link to="#" className="text-gray-300 hover:text-blue-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-bold">Danh mục</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="#" className="text-gray-300 hover:text-blue-300">
                      Điện thoại
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-300 hover:text-blue-300">
                      Laptop
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-300 hover:text-blue-300">
                      Máy tính bảng
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-300 hover:text-blue-300">
                      Phụ kiện
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-300 hover:text-blue-300">
                      Đồng hồ thông minh
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-bold">Hỗ trợ</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="#" className="text-gray-300 hover:text-blue-300">
                      Hướng dẫn mua hàng
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-300 hover:text-blue-300">
                      Chính sách bảo hành
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-300 hover:text-blue-300">
                      Chính sách đổi trả
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-300 hover:text-blue-300">
                      Vận chuyển & Thanh toán
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-bold">Liên hệ</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2 text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 shrink-0"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 shrink-0"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>0123 456 789</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 shrink-0"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>info@ecomic-smartnet.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-900 py-4">
          <div className="mx-auto max-w-5xl px-4">
            <p className="text-center text-sm text-gray-400">© 2025 Ecomic-smartNet. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Sample data
const categories = [
  { name: "Điện thoại" },
  { name: "Laptop" },
  { name: "Máy tính bảng" },
  { name: "Đồng hồ thông minh" },
  { name: "Tai nghe" },
  { name: "Phụ kiện" },
]

const featuredProducts = [
  { name: "MacBook Air M3", price: "26.990.000", sold: 124 },
  { name: "Samsung Galaxy Tab S9", price: "19.990.000", oldPrice: "22.990.000", sold: 98 },
  { name: "Xiaomi 14 Pro", price: "18.990.000", sold: 156 },
  { name: "ASUS ROG Phone 8", price: "24.990.000", sold: 87 },
  { name: "Apple Watch Series 9", price: "10.990.000", oldPrice: "12.990.000", sold: 203 },
]

const newArrivals = [
  { name: "Nothing Phone (2a)", price: "8.990.000" },
  { name: "Laptop Lenovo Legion Pro 7", price: "39.990.000" },
  { name: "Tai nghe Sony WH-1000XM5", price: "8.490.000" },
  { name: "Google Pixel 8 Pro", price: "22.990.000" },
  { name: "Samsung Galaxy Book4 Pro", price: "32.990.000" },
]

const brands = ["Apple", "Samsung", "Xiaomi", "Asus", "Lenovo", "Sony"]
