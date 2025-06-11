import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Menu,
  X,
  Home,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/format';


const SalesDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [loading, setLoading] = useState(false);

  // Dữ liệu mẫu
  const salesData = [
    { name: 'T2', revenue: 12000000, orders: 45, customers: 38, products: 156 },
    { name: 'T3', revenue: 19000000, orders: 67, customers: 52, products: 234 },
    { name: 'T4', revenue: 15000000, orders: 58, customers: 43, products: 198 },
    { name: 'T5', revenue: 22000000, orders: 78, customers: 65, products: 287 },
    { name: 'T6', revenue: 28000000, orders: 95, customers: 78, products: 345 },
    { name: 'T7', revenue: 35000000, orders: 125, customers: 98, products: 456 },
    { name: 'CN', revenue: 31000000, orders: 108, customers: 87, products: 389 }
  ];

  // Dữ liệu cho 8 thẻ thống kê
  const statsData = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(162000000, "VND"),
      change: 12.5,
      icon: DollarSign,
      color: "blue",
      subtitle: "Tuần này"
    },
    {
      title: "Đơn hàng",
      value: formatNumber(576),
      change: 8.2,
      icon: ShoppingCart,
      color: "green",
      subtitle: "Đơn hàng mới"
    },
    {
      title: "Khách hàng",
      value: formatNumber(461),
      change: 15.3,
      icon: Users,
      color: "purple",
      subtitle: "Khách hàng hoạt động"
    },
    {
      title: "Sản phẩm bán",
      value: formatNumber(1247),
      change: -2.1,
      icon: Package,
      color: "orange",
      subtitle: "Sản phẩm"
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: "4.2%",
      change: 0.8,
      icon: TrendingUp,
      color: "blue",
      subtitle: "Conversion rate"
    },
    {
      title: "Giá trị đơn hàng TB",
      value: formatCurrency(281250),
      change: 5.4,
      icon: DollarSign,
      color: "green",
      subtitle: "AOV"
    },
    {
      title: "Khách hàng mới",
      value: formatNumber(89),
      change: 22.1,
      icon: Users,
      color: "purple",
      subtitle: "Tuần này"
    },
    {
      title: "Tồn kho",
      value: formatNumber(2854),
      change: -1.2,
      icon: Package,
      color: "orange",
      subtitle: "Sản phẩm còn lại"
    }
  ];

  const productCategories = [
    { name: 'Điện thoại', value: 45, color: '#3b82f6', sales: 1250000000 },
    { name: 'Laptop', value: 25, color: '#10b981', sales: 890000000 },
    { name: 'Phụ kiện', value: 20, color: '#f59e0b', sales: 456000000 },
    { name: 'Tablet', value: 10, color: '#ef4444', sales: 234000000 }
  ];

  const monthlyTrend = [
    { month: 'Tháng 1', revenue: 4500000000, growth: 5.2 },
    { month: 'Tháng 2', revenue: 5200000000, growth: 8.1 },
    { month: 'Tháng 3', revenue: 4800000000, growth: -2.3 },
    { month: 'Tháng 4', revenue: 6100000000, growth: 12.5 },
    { month: 'Tháng 5', revenue: 7200000000, growth: 15.8 },
    { month: 'Tháng 6', revenue: 8500000000, growth: 18.2 }
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 234, revenue: 587000000, growth: 12.5 },
    { name: 'MacBook Air M2', sales: 156, revenue: 468000000, growth: 8.2 },
    { name: 'Samsung Galaxy S24', sales: 189, revenue: 378000000, growth: -2.1 },
    { name: 'iPad Pro', sales: 123, revenue: 246000000, growth: 15.6 },
    { name: 'AirPods Pro', sales: 345, revenue: 172500000, growth: 22.3 }
  ];



  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const StatCard = ({ title, value, change, icon: Icon, trend, color = "blue", subtitle }) => {
    const isPositive = change > 0;
    const colorClasses = {
      blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
    };

    return (
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colorClasses[color]} p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Icon className="w-5 h-5 mr-2 opacity-80" />
              <p className="text-sm font-medium text-white/90">{title}</p>
            </div>
            <p className="text-3xl font-bold mb-1">{value}</p>
            {subtitle && <p className="text-sm text-white/70 mb-3">{subtitle}</p>}
            <div className="flex items-center">
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
                {isPositive ? '+' : ''}{change}% so với kỳ trước
              </span>
            </div>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Bán Hàng</h1>
                <p className="text-sm text-gray-600">Chào mừng trở lại, Admin!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="3months">3 tháng qua</option>
                <option value="6months">6 tháng qua</option>
              </select>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </button>
            </div>
          </div>

          {/* Stats Grid - 2 hàng, 4 cột */}
          <div className="mb-8">
            {/* Hàng 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {statsData.slice(0, 4).map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  icon={stat.icon}
                  color={stat.color}
                  subtitle={stat.subtitle}
                />
              ))}
            </div>
            
            {/* Hàng 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.slice(4, 8).map((stat, index) => (
                <StatCard
                  key={index + 4}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  icon={stat.icon}
                  color={stat.color}
                  subtitle={stat.subtitle}
                />
              ))}
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Doanh thu hàng ngày</h3>
                  <p className="text-sm text-gray-600">Xu hướng doanh thu 7 ngày qua</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Doanh thu</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Product Categories */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Danh mục sản phẩm</h3>
                  <p className="text-sm text-gray-600">Phân bố theo doanh thu</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={productCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-6 space-y-3">
                {productCategories.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        <p className="text-xs text-gray-600">{formatCurrency(item.sales)}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trend */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Xu hướng theo tháng</h3>
                  <p className="text-sm text-gray-600">Doanh thu 6 tháng gần nhất</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000000000}B`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Sản phẩm bán chạy</h3>
                  <p className="text-sm text-gray-600">Top 5 sản phẩm</p>
                </div>
              </div>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-white font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.sales} sản phẩm • {formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {product.growth > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalesDashboard;