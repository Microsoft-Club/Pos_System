import pool from "../database.js";
import { AppError } from "../utils/error.js";

const buildTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.line_total), 0);
    const total = parseFloat((subtotal + tax).toFixed(2));
    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        total
    };
};

const withTotals = (order) => ({
    ...order,
    ...buildTotals(order.items || [])
});

const mapOrderRow = (header, itemRows) => {
    const items = itemRows.map((row) => ({
        name: row.name,
        type: row.type,
        quantity: parseInt(row.quantity, 10),
        unit_price: parseFloat(row.unit_price),
        line_total: parseFloat(row.line_total)
    }));

    return withTotals({
        id: header.id,
        created_at: header.created_at,
        company_id: header.company_id,
        company_name: header.company_name,
        company_logo: header.company_logo || null,
        printed_at: header.printed_at || null,
        items
    });
};

// GET /api/v1/receipts — recent orders for reprint / preview
export const getRecentReceipts = async (req, res, next) => {
    const { limit = 20 } = req.query;

    try {
        const headerQuery = `
            SELECT
                o.id,
                o.created_at,
                o.company_id,
                o.printed_at,
                c.name AS company_name,
                NULLIF(c.logo, '') AS company_logo,
                COALESCE(SUM(oi.quantity * i.price), 0) AS order_total
            FROM orders o
            JOIN company c ON c.id = o.company_id
            JOIN order_items oi ON oi.order_id = o.id
            JOIN items i ON i.id = oi.item_id
            GROUP BY o.id, o.created_at, o.company_id, o.printed_at, c.name, c.logo
            ORDER BY o.id DESC
            LIMIT $1;
        `;
        const headers = await pool.query(headerQuery, [Math.min(parseInt(limit, 10) || 20, 50)]);

        const orderIds = headers.rows.map((row) => row.id);
        const itemsQuery = `
            SELECT
                oi.order_id,
                i.name,
                i.type,
                oi.quantity,
                i.price AS unit_price,
                (oi.quantity * i.price) AS line_total
            FROM order_items oi
            JOIN items i ON i.id = oi.item_id
            WHERE oi.order_id = ANY($1::int[])
            ORDER BY oi.order_id DESC, i.name ASC;
        `;
        const itemsResult = await pool.query(itemsQuery, [orderIds]);

        const itemsByOrder = {};
        for (const row of itemsResult.rows) {
            if (!itemsByOrder[row.order_id]) itemsByOrder[row.order_id] = [];
            itemsByOrder[row.order_id].push(row);
        }

        const data = headers.rows.map((header) =>
            mapOrderRow(header, itemsByOrder[header.id] || [])
        );

        return res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/receipts/:id — full receipt payload for one order
export const getReceiptById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const headerQuery = `
            SELECT
                o.id,
                o.created_at,
                o.company_id,
                o.printed_at,
                c.name AS company_name,
                NULLIF(c.logo, '') AS company_logo
            FROM orders o
            JOIN company c ON c.id = o.company_id
            WHERE o.id = $1;
        `;
        const headerResult = await pool.query(headerQuery, [id]);

        const itemsQuery = `
            SELECT
                i.name,
                i.type,
                oi.quantity,
                i.price AS unit_price,
                (oi.quantity * i.price) AS line_total
            FROM order_items oi
            JOIN items i ON i.id = oi.item_id
            WHERE oi.order_id = $1
            ORDER BY i.name ASC;
        `;
        const itemsResult = await pool.query(itemsQuery, [id]);

        return res.status(200).json({
            success: true,
            data: mapOrderRow(headerResult.rows[0], itemsResult.rows)
        });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/v1/receipts/:id/print — record payment method + printed timestamp
export const markReceiptPrinted = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
            UPDATE orders
            printed_at = NOW()
            WHERE id = $2
            RETURNING id, printed_at, created_at, company_id;
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Receipt marked as printed.",
            data: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
};
