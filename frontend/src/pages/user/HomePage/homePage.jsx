

import { Search, ShoppingCart, User } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Biến ngôi nhà của bạn thành Smart Home hiện đại!
            </h1>
            <p className="text-gray-600">
              Với các giải pháp thông minh của chúng tôi, bạn có thể điều khiển mọi thiết bị, 
              nâng cao sự tiện nghi và an ninh cho ngôi nhà của mình một cách dễ dàng.
            </p>
            <button className="px-6 py-2 border border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
              Tìm hiểu thêm
            </button>
          </div>
          <div className="flex-1 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <span className="text-gray-500">HÌNH ẢNH</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Danh mục</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🔆", name: "Thiết Bị Ánh Sáng" },
              { icon: "🎮", name: "Thiết Bị Điều Sáng" },
              { icon: "🔌", name: "Điều Khiển Thiết Bị" },
              { icon: "📹", name: "Cam Biến Môi Trường" }
            ].map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  {category.icon}
                </div>
                <p className="text-gray-700">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Thiết bị nổi bật</h2>
            {/* <Link href="/products" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Xem tất cả
            </Link> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Đèn thông minh RGB</h3>
              <div className="flex text-yellow-400 mb-2">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Điều khiển ánh sáng, màu sắc và độ sáng từ xa qua ứng dụng di động.
              </p>
              <button className="w-full px-4 py-2 border border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
                Thêm vào giỏ hàng
              </button>
            </div>
            {/* Add more product items here */}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Gói giải pháp nhà thông minh</h2>
          <p className="text-gray-600 mb-8">
            Chọn gói giải pháp phù hợp với nhu cầu và ngân sách của bạn
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Gói Cơ bản", price: "4.980.000" },
              { name: "Gói An ninh", price: "8.680.000" },
              { name: "Gói Tiện nghi", price: "12.980.000" },
              { name: "Gói Cao cấp", price: "24.980.000" }
            ].map((solution, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4">{solution.name}</h3>
                <div className="text-xl font-bold mb-6">₫ {solution.price}</div>
                <button className="w-full px-4 py-2 border border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Quy trình triển khai</h2>
          <p className="text-gray-600 mb-12">
            Các bước đơn giản để lắp đặt và sử dụng hệ thống nhà thông minh
          </p>
          <div className="max-w-2xl mx-auto space-y-8">
            {[
              {
                number: 1,
                title: "Tư vấn & Khảo sát",
                description: "Chuyên gia của chúng tôi sẽ tư vấn và khảo sát ngôi nhà của bạn để đưa ra giải pháp phù hợp nhất."
              },
              {
                number: 2,
                title: "Thiết kế & Báo giá",
                description: "Đội ngũ kỹ thuật sẽ thiết kế hệ thống và đưa ra báo giá chi tiết cho từng hạng mục."
              },
              {
                number: 3,
                title: "Lắp đặt & Cài đặt",
                description: "Kỹ thuật viên sẽ tiến hành lắp đặt và cài đặt các thiết bị theo đúng thiết kế đã thống nhất."
              },
              {
                number: 4,
                title: "Hướng dẫn & Hỗ trợ",
                description: "Chúng tôi sẽ hướng dẫn sử dụng và hỗ trợ kỹ thuật 24/7 để đảm bảo hệ thống hoạt động tốt nhất."
              }
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {step.number}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-12 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Liên hệ ngay
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Smart Home Solutions. Tất cả các quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  )
} 