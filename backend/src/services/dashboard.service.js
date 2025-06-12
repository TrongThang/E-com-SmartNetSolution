const jwt = require('jsonwebtoken');
const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const queryHelper = require('../helpers/query.helper');
const { ORDER } = require('../contants/info');
const { createStatsCard, formatSalesDataToWeekday, formatSalesDataToMonth, formatSalesDataToTop4Categories, formatTop5Products } = require('../helpers/dashboard.helper');

async function processPeriod(period) {
    const today = new Date();
    const startDate = new Date(today);

    if (period === '7d') {
        startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30d') {
        startDate.setDate(startDate.getDate() - 30);
    } else if (period === '3m') {
        startDate.setMonth(startDate.getMonth() - 3);
    } else if (period === '6m') {
        startDate.setMonth(startDate.getMonth() - 6);
    } else if (period === '1y') {
        startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / millisecondsPerDay);

    return diffDays;
}

/**
 * Lấy ra doanh thu trong khoảng thời gian
 * @param {*} period 
 * @returns 
 */
async function getChartStatisticsService(period) {
    period = await processPeriod(period);
    
    // 1. BIỂU ĐỒ - Doanh thu trung bình theo ngày trong tuần
    const revenueAvgWeekday = await queryHelper.queryRaw(
        `
            WITH weekdays AS (
                SELECT 0 AS weekday_num UNION ALL
                SELECT 1 UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6
            ),
            daily_data AS (
                SELECT 
                    DATE(created_at) AS day,
                    WEEKDAY(created_at) AS weekday_num,
                    SUM(amount) AS daily_total
                FROM \`order\`
                WHERE 
                    status = ${ORDER.COMPLETED}
                    AND created_at >= CURDATE() - INTERVAL ${period} DAY
                GROUP BY DATE(created_at), WEEKDAY(created_at)
            ),
            avg_per_weekday AS (
                SELECT 
                    weekday_num,
                    AVG(daily_total) AS avg_revenue
                FROM daily_data
                GROUP BY weekday_num
            )
            SELECT 
                w.weekday_num,
                COALESCE(a.avg_revenue, 0) AS avg_revenue
            FROM weekdays w
            LEFT JOIN avg_per_weekday a ON w.weekday_num = a.weekday_num
            ORDER BY w.weekday_num;
        `,
    );

    //  Hiệu chỉnh dữ liệu gửi về FE
    const resultRevenueAvgWeekday = formatSalesDataToWeekday(revenueAvgWeekday);

    // 2. BIỂU ĐỒ - Doanh thu theo tháng
    const revenueByMonth = await queryHelper.queryRaw(
        `
            WITH months AS (
                SELECT 
                    DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m-01') AS month_start
                FROM (
                    SELECT 0 AS n UNION ALL
                    SELECT 1 UNION ALL
                    SELECT 2 UNION ALL
                    SELECT 3 UNION ALL
                    SELECT 4 UNION ALL
                    SELECT 5 UNION ALL
                    SELECT 6
                ) numbers
                WHERE DATE_SUB(CURDATE(), INTERVAL n MONTH) <= CURDATE()
            ),
            monthly_data AS (
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m-01') AS month_start,
                SUM(amount) AS monthly_total
            FROM \`order\`
            WHERE 
                status = ${ORDER.COMPLETED}
                AND created_at >= CURDATE() - INTERVAL ${period} DAY
            GROUP BY DATE_FORMAT(created_at, '%Y-%m-01')
            )
            SELECT 
                MONTH(m.month_start) as month,
                COALESCE(md.monthly_total, 0) AS total_revenue
            FROM months m
                LEFT JOIN monthly_data md ON m.month_start = md.month_start
            WHERE m.month_start <= CURDATE()
                AND m.month_start >= DATE_SUB(CURDATE(), INTERVAL ${Math.floor(period / 30)} MONTH)
            ORDER BY m.month_start ASC;
        `
    );

    //  Hiệu chỉnh dữ liệu gửi về FE
    const resultRevenueByMonth = formatSalesDataToMonth(revenueByMonth);

    // 3. BIỂU ĐỒ - Danh mục sản phẩm bán chạy nhất - TOP 4
    const top4Categories = await queryHelper.queryRaw(
        `
            SELECT 
                p.category_id,
                c.name as category_name,
                SUM(o.amount) AS total_revenue
            FROM 
                product p
                JOIN 
                    categories c ON p.category_id = c.category_id
                JOIN 
                    order_detail o ON p.id = o.product_id
                JOIN 
                    \`order\` o2 ON o.order_id = o2.id
            WHERE 
                o2.status = ${ORDER.COMPLETED}
                AND o2.created_at >= CURDATE() - INTERVAL ${period} DAY
            GROUP BY 
                p.category_id
            ORDER BY 
                total_revenue DESC
            LIMIT 4
        `
    )

    //  Hiệu chỉnh dữ liệu gửi về FE
    const resultTop4Categories = formatSalesDataToTop4Categories(top4Categories);

    // 4. BIỂU ĐỒ - Sản phẩm bán chạy nhất - TOP 5
    const top5ProductsBestSeller = await queryHelper.queryRaw(
        `
            SELECT 
                p.id,
                p.name,
                SUM(CASE 
                    WHEN o2.created_at >= CURDATE() - INTERVAL ${period} DAY 
                    THEN o.quantity_sold 
                    ELSE 0 
                END) AS total_quantity_current,
                SUM(CASE 
                    WHEN o2.created_at BETWEEN CURDATE() - INTERVAL (${period} + ${period}) DAY AND CURDATE() - INTERVAL ${period} DAY 
                    THEN o.quantity_sold 
                    ELSE 0 
                END) AS total_quantity_previous
            FROM 
                product p
            JOIN 
                order_detail o ON p.id = o.product_id
            JOIN 
                \`order\` o2 ON o.order_id = o2.id
            WHERE 
                o2.status = ${ORDER.COMPLETED}
                AND o2.created_at >= CURDATE() - INTERVAL (${period} + ${period}) DAY
            GROUP BY 
                p.id,
                p.name
            ORDER BY 
                total_quantity_current DESC
            LIMIT 5;
        `
    )

    //  Hiệu chỉnh dữ liệu gửi về FE
    const resultTop5ProductsBestSeller = formatTop5Products(top5ProductsBestSeller);
    
    return get_error_response(
        ERROR_CODES.SUCCESS,
        STATUS_CODE.SUCCESS,
        data = {
            resultRevenueAvgWeekday,
            resultRevenueByMonth,
            resultTop4Categories,
            resultTop5ProductsBestSeller
        }
    )
}

/**
 * Lấy ra thống kê các card trong khoảng thời gian
 * @param {*} period 
 * @returns 
 */
async function getCardStatisticsService(period) {

    period = await processPeriod(period);

    // 1. CARD - Số lượng sản phẩm đã bán trong khoảng thời gian - Tổng số lượng sản phẩm đã bán
    let productSold = await queryHelper.queryRaw(
        `
            SELECT 
            SUM(CASE 
                WHEN \`order\`.created_at >= CURDATE() - INTERVAL ${period} DAY 
                THEN order_detail.quantity_sold 
                ELSE 0 
            END) AS total_quantity_current,
            SUM(CASE 
                WHEN \`order\`.created_at BETWEEN CURDATE() - INTERVAL (${period} + ${period}) DAY AND CURDATE() - INTERVAL ${period} DAY 
                THEN order_detail.quantity_sold 
                ELSE 0 
            END) AS total_quantity_previous
        FROM 
            order_detail
        LEFT JOIN 
            \`order\` ON order_detail.order_id = \`order\`.id
        WHERE 
            \`order\`.status = ${ORDER.COMPLETED}
            AND \`order\`.created_at >= CURDATE() - INTERVAL (${period} + ${period}) DAY;
        `
    )

    // 2. CARD - Giá trị trung bình của mỗi đơn hàng trong khoảng thời gian - Giá trị trung bình của mỗi đơn hàng
    let avgOrderValue = await queryHelper.queryRaw(
        `
            SELECT 
                CAST(AVG(CASE 
                    WHEN \`order\`.created_at >= CURDATE() - INTERVAL ${period} DAY 
                    THEN \`order\`.amount 
                    ELSE NULL 
                END) AS DECIMAL(10,2)) AS avg_order_value_current,
                CAST(AVG(CASE 
                    WHEN \`order\`.created_at BETWEEN CURDATE() - INTERVAL (${period} + ${period}) DAY AND CURDATE() - INTERVAL ${period} DAY 
                    THEN \`order\`.amount 
                    ELSE NULL 
                END) AS DECIMAL(10,2)) AS avg_order_value_previous
            FROM 
                \`order\`
            WHERE 
                \`order\`.status = ${ORDER.COMPLETED}
                AND \`order\`.created_at >= CURDATE() - INTERVAL (${period} + ${period}) DAY;
        `
    )

    // 3. CARD - Số lượng đơn hàng trong khoảng thời gian - Số lượng đơn hàng mới
    let newOrderCount = await queryHelper.queryRaw(
        `
            SELECT 
                SUM(CASE 
                    WHEN \`order\`.created_at >= CURDATE() - INTERVAL ${period} DAY 
                    THEN 1 
                    ELSE 0 
                END) AS total_new_orders_current,
                SUM(CASE 
                    WHEN \`order\`.created_at BETWEEN CURDATE() - INTERVAL (${period} + ${period}) DAY AND CURDATE() - INTERVAL ${period} DAY 
                    THEN 1 
                    ELSE 0 
                END) AS total_new_orders_previous
            FROM 
                \`order\`
            WHERE 
                \`order\`.status NOT IN (${ORDER.PENDING}, ${ORDER.CANCELLED})
                AND \`order\`.created_at >= CURDATE() - INTERVAL (${period} + ${period}) DAY;
        `
    )

    // 4. CARD - Khách hàng đăng ký tài khoản mới trong khoảng thời gian - Số lượng khách hàng đăng ký tài khoản mới
    let newCustomerCount = await queryHelper.queryRaw(
        `
            SELECT 
                SUM(CASE 
                    WHEN created_at >= CURDATE() - INTERVAL ${period} DAY 
                    THEN 1 
                    ELSE 0 
                END) AS total_new_customers_current,
                SUM(CASE 
                    WHEN created_at BETWEEN CURDATE() - INTERVAL (${period} + ${period}) DAY AND CURDATE() - INTERVAL ${period} DAY 
                    THEN 1 
                    ELSE 0 
                END) AS total_new_customers_previous
            FROM 
                account
            WHERE 
                employee_id IS NULL
                AND created_at >= CURDATE() - INTERVAL (${period} + ${period}) DAY;
        `
    )

    // 5. CARD - Doanh thu trong khoảng thời gian - Tổng doanh thu
    let revenueTotal = await queryHelper.queryRaw( 
        `
            SELECT 
                SUM(CASE 
                    WHEN created_at >= CURDATE() - INTERVAL ${period} DAY 
                    THEN amount 
                    ELSE 0 
                END) AS total_revenue_current,
                SUM(CASE 
                    WHEN created_at BETWEEN CURDATE() - INTERVAL (${period} + ${period}) DAY AND CURDATE() - INTERVAL ${period} DAY 
                    THEN amount 
                    ELSE 0 
                END) AS total_revenue_previous
            FROM 
                \`order\`
            WHERE 
                status = ${ORDER.COMPLETED}
                AND created_at >= CURDATE() - INTERVAL (${period} + ${period}) DAY;
        `
    );

    // 6. CARD - Số lượng sản phẩm còn lại trong kho - Số lượng sản phẩm còn lại trong kho
    // const remainingProductCount = await queryHelper.queryRaw(
    //     ` 
    //     `
    // )

    // 7. Số lượng đơn hàng được đặt trong khoảng thời gian - Số lượng đơn hàng được đặt trong khoảng thời gian
    let orderPlacedCount = await queryHelper.queryRaw(
        `
            SELECT 
                SUM(CASE 
                    WHEN \`order\`.created_at >= CURDATE() - INTERVAL ${period} DAY 
                    THEN 1 
                    ELSE 0 
                END) AS total_new_orders_current,
                SUM(CASE 
                    WHEN \`order\`.created_at BETWEEN CURDATE() - INTERVAL (${period} + ${period}) DAY AND CURDATE() - INTERVAL ${period} DAY 
                    THEN 1 
                    ELSE 0 
                END) AS total_new_orders_previous
            FROM 
                \`order\`
            WHERE 
                \`order\`.status = ${ORDER.COMPLETED}
                AND \`order\`.created_at >= CURDATE() - INTERVAL (${period} + ${period}) DAY;
        `
    )

    // 1.
    productSold = createStatsCard({
        title: 'Số lượng sản phẩm đã bán',
        currentValue: productSold[0].total_quantity_current,
        previousValue: productSold[0].total_quantity_previous,
        icon: 'product',
        color: 'blue',
    });

    // 2. 
    avgOrderValue = createStatsCard({
        title: 'Giá trị đơn hàng TB',
        currentValue: avgOrderValue[0].avg_order_value_current,
        previousValue: avgOrderValue[0].avg_order_value_previous,
        icon: 'order',
        color: 'green',
        type: 'currency'
    });

    // 3. 
    newOrderCount = createStatsCard({
        title: 'Đơn hàng',
        currentValue: newOrderCount[0].total_new_orders_current,
        previousValue: newOrderCount[0].total_new_orders_previous,
        icon: 'order',
        color: 'yellow',
    });

    // 4. 
    newCustomerCount = createStatsCard({
        title: 'Khách hàng mới',
        currentValue: newCustomerCount[0].total_new_customers_current,
        previousValue: newCustomerCount[0].total_new_customers_previous,
        icon: 'customer',
        color: 'orange',
    });

    // 5. 
    revenueTotal = createStatsCard({
        title: 'Tổng doanh thu',
        currentValue: revenueTotal[0].total_revenue_current,
        previousValue: revenueTotal[0].total_revenue_previous,
        icon: 'revenue',
        color: 'yellow',
        type: 'currency'
    });

    // 7. 
    orderPlacedCount = createStatsCard({
        title: 'Đơn hàng',
        currentValue: orderPlacedCount[0].total_new_orders_current,
        previousValue: orderPlacedCount[0].total_new_orders_previous,
        icon: 'order',
        color: 'green',
    });


    return get_error_response(
        ERROR_CODES.SUCCESS,
        STATUS_CODE.SUCCESS,
        data = [
            revenueTotal, 
            orderPlacedCount,
            newCustomerCount,
            productSold,
            avgOrderValue,
            newOrderCount,
        ]
    )
}


module.exports = {
    getChartStatisticsService,
    getCardStatisticsService
}