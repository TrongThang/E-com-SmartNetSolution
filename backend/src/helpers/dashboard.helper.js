function createStatsCard({
    title,
    currentValue,
    previousValue,
    icon,
    color,
    subtitle,
    type = 'number'
}) {
    // Tính phần trăm thay đổi
    const change = previousValue > 0
        ? ((currentValue - previousValue) / previousValue * 100).toFixed(1)
        : currentValue > 0 ? 100 : 0;
    
    return {
        title,
        value: currentValue,
        change: parseFloat(change),
        icon,
        color,
        subtitle,
        type,
    };
}

/**
 * Hiệu chỉnh dữ liệu từ salesData thành định dạng [{ name, avg_revenue }]
 * @param {Array} salesData - Dữ liệu với weekday_num và avg_revenue
 * @returns {Array} - Mảng các đối tượng với name và avg_revenue
 */
function formatSalesDataToWeekday(salesData) {
    // Đảo ngược weekdayMap để ánh xạ từ weekday_num sang name
    const weekdayMap = {
        0: 'T2',
        1: 'T3',
        2: 'T4',
        3: 'T5',
        4: 'T6',
        5: 'T7',
        6: 'CN'
    };

    return salesData.map(item => ({
        name: weekdayMap[Number(item.weekday_num)],
        revenue: Number(item.avg_revenue),
    }));
}

function formatSalesDataToMonth(salesData) {
    console.log('salesData', salesData);

    return salesData.map(item => ({
        month: 'Tháng ' + Number(item.month),
        revenue: Number(item.total_revenue),
    }));
}

function formatSalesDataToTop4Categories(top4Categories) {
    const totalRevenue = top4Categories.reduce((acc, item) => acc + Number(item.total_revenue), 0);

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];


    return top4Categories.map((item, index) => ({
        name: item.category_name,
        sales: Number(item.total_revenue),
        value: Number(item.total_revenue) > 0
            ?
                Number(
                    ((Number(item.total_revenue) / Number(totalRevenue)) * 100).toFixed(1)
                )
            : 0,
        color: colors[index],
    }));
}

/**
 * Hiệu chỉnh dữ liệu từ top5ProductsBestSeller thành định dạng tương tự topProducts
 * @param {Array} top5ProductsBestSeller - Dữ liệu từ truy vấn SQL
 * @returns {Array} - Mảng các đối tượng với name, sales, revenue, growth
 */
function formatTop5Products(top5ProductsBestSeller) {
    console.log('top5ProductsBestSeller', top5ProductsBestSeller);
    const result = top5ProductsBestSeller.map(item => {
        // Tính growth: phần trăm thay đổi của total_quantity_current so với total_quantity_previous
        const sales = Number(item.total_quantity_current) || 0;
        const previousSales = Number(item.total_quantity_previous) || 0;
        const growth = previousSales > 0
            ? ((sales - previousSales) / previousSales * 100).toFixed(1)
            : sales > 0 ? 100 : 0;

        // Giả định revenue cần được tính (nếu có dữ liệu giá từ product)
        // Ở đây, tạm thời dùng total_quantity_current * giá trung bình giả định (ví dụ: từ dữ liệu khác)
        // Nếu không có giá, cần truy vấn bổ sung hoặc lấy từ topProducts
        const revenue = item.revenue || sales * 1000000; // Giả định giá trung bình 1,000,000 VND/sản phẩm

        return {
            name: item.name,
            sales,
            revenue,
            growth: parseFloat(growth)
        };
    });

    console.log('result', result);
    return result;
}

module.exports = {
    createStatsCard,
    formatSalesDataToWeekday,
    formatSalesDataToMonth,
    formatSalesDataToTop4Categories,
    formatTop5Products
}