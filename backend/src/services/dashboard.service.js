const jwt = require('jsonwebtoken');
const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const QueryHelper = require('../helpers/query.helper');
const { ORDER } = require('../contants/info');

async function getRevenue(period) {
    const queryHelper = new QueryHelper();

    if (period === '7d') {
        period = 7;
    } else if (period === '30d') {
        period = 30;
    } else if (period === '3m') {
        period = 90;
    } else if (period === '6m') {
        period = 182;
    } else if (period === '1y') {
        period = 365;
    }

    const revenueTotal = await queryHelper.queryRaw( 
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
    
    const top4Categories = await queryHelper.queryRaw(
        `
            SELECT 
                p.category_id,
                SUM(o.amount) AS total_revenue
            FROM 
                product p
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

    return {
        revenueTotal,
        revenueAvgWeekday,
        top4Categories
    }
}

async function getProductsBestSeller(period) {
    const queryHelper = new QueryHelper();

    if (period === '7d') {
        period = 7;
    } else if (period === '30d') {
        period = 30;
    } else if (period === '3m') {
        period = 90;
    } else if (period === '6m') {
        period = 182;
    } else if (period === '1y') {
        period = 365;
    }

    const productsBestSeller = await queryHelper.queryRaw(
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

    return productsBestSeller;
}

async function getOrderStatistics(period) {
    const queryHelper = new QueryHelper();

    const productSold = await queryHelper.queryRaw(
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
}