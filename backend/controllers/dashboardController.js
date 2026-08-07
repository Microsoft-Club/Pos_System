import pool from "../database.js";


export const getDashboardStats = async (req, res, next) => {
    try {
        // 1. Get Today's Total Sales & Orders
        const statsQuery = `
            SELECT 
                COALESCE(SUM(oi.quantity * i.price), 0) AS today_sales,
                COUNT(DISTINCT o.id) AS today_orders,
                COALESCE(SUM(oi.quantity), 0) AS items_sold
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN items i ON oi.item_id = i.id
            WHERE o.created_at = CURRENT_DATE;
        `;
        const statsResult = await pool.query(statsQuery);
        const todaySales = parseFloat(statsResult.rows[0].today_sales);
        const todayOrders = parseInt(statsResult.rows[0].today_orders);
        const itemsSold = parseInt(statsResult.rows[0].items_sold);

        // 2. Get 7 Days Weekly Sales Trend
        const trendQuery = `
            SELECT 
                d.date::date AS sale_date,
                COALESCE(SUM(oi.quantity * i.price), 0) AS daily_sales,
                COUNT(DISTINCT o.id) AS daily_orders
            FROM (
                SELECT generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day')::date AS date
            ) d
            LEFT JOIN orders o ON DATE(o.created_at) = d.date
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN items i ON oi.item_id = i.id
            GROUP BY d.date
            ORDER BY d.date ASC;
        `;
        const trendResult = await pool.query(trendQuery);
        const weeklySales = trendResult.rows.map(row => {
            const dateObj = new Date(row.sale_date);
            return {
                date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                sales: parseFloat(row.daily_sales),
                orders: parseInt(row.daily_orders)
            };
        });

        // 3. Get Today's Recent Orders
        const recentOrdersQuery = `
            SELECT 
                o.id,
                o.created_at,
                STRING_AGG(CONCAT(oi.quantity, 'x ', i.name), ', ') AS items,
                SUM(oi.quantity * i.price) AS total
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN items i ON oi.item_id = i.id
            WHERE o.created_at = CURRENT_DATE
            GROUP BY o.id, o.created_at
            ORDER BY o.id DESC
            LIMIT 5;
        `;
        const recentOrdersResult = await pool.query(recentOrdersQuery);
        const recentOrders = recentOrdersResult.rows.map(row => ({
            id: row.id,
            time: new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
            items: row.items,
            total: parseFloat(row.total),
            status: "Completed"
        }));

        return res.status(200).json({
            success: true,
            data: {
                todaySales,
                todayOrders,
                itemsSold,
                totalCashCollected: todaySales,
                weeklySales,
                recentOrders
            }
        });

    } catch (error) {
        next(error);
    }
};
