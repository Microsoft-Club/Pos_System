import pool from "../database.js";

const TAX_RATE = parseFloat(process.env.TAX_RATE || "0");

const mockOrders = [
    {
        id: 1045,
        created_at: new Date().toISOString(),
        company_id: 1,
        company_name: "Biryani Junction",
        company_logo: null,
        payment_method: "CASH",
        printed_at: null,
        items: [
            { name: "Full Chicken Biryani", type: "FULL", quantity: 2, unit_price: 520.0, line_total: 1040.0 },
            { name: "Coke 1.5L", type: "FAMILY", quantity: 1, unit_price: 150.0, line_total: 150.0 }
        ]
    },
    {
        id: 1044,
        created_at: new Date().toISOString(),
        company_id: 1,
        company_name: "Biryani Junction",
        company_logo: null,
        payment_method: "CARD",
        printed_at: null,
        items: [
            { name: "Half Beef Biryani", type: "HALF", quantity: 1, unit_price: 380.0, line_total: 380.0 },
            { name: "Raita", type: "HALF", quantity: 1, unit_price: 50.0, line_total: 50.0 }
        ]
    },
    {
        id: 1043,
        created_at: new Date().toISOString(),
        company_id: 1,
        company_name: "Biryani Junction",
        company_logo: null,
        payment_method: "CASH",
        printed_at: null,
        items: [
            { name: "Family Pack Biryani", type: "FAMILY", quantity: 1, unit_price: 1450.0, line_total: 1450.0 },
            { name: "Salad", type: "HALF", quantity: 2, unit_price: 50.0, line_total: 100.0 }
        ]
    }
];

const buildTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.line_total), 0);
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));
    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax,
        tax_rate: TAX_RATE,
        total
    };
};

const withTotals = (order) => ({
    ...order,
    ...buildTotals(order.items || [])
});

const ensureReceiptColumns = async () => {
    try {
        await pool.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'CASH'
        `);
        await pool.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS printed_at TIMESTAMP
        `);
    } catch (err) {
        // Older Postgres or missing table — controllers still work via fallbacks
        console.warn("Could not ensure receipt columns:", err.message);
    }
};

let columnsReady = false;
const ready = async () => {
    if (!columnsReady) {
        await ensureReceiptColumns();
        columnsReady = true;
    }
};

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
        payment_method: header.payment_method || "CASH",
        printed_at: header.printed_at || null,
        items
    });
};

// GET /api/v1/receipts — recent orders for reprint / preview
export const getRecentReceipts = async (req, res) => {
    const { demo, limit = 20 } = req.query;

    if (demo === "true") {
        return res.status(200).json({
            success: true,
            data: mockOrders.map(withTotals),
            isDemoData: true
        });
    }

    try {
        await ready();

        const headerQuery = `
            SELECT
                o.id,
                o.created_at,
                o.company_id,
                COALESCE(o.payment_method, 'CASH') AS payment_method,
                o.printed_at,
                c.name AS company_name,
                NULLIF(c.logo, '') AS company_logo,
                COALESCE(SUM(oi.quantity * i.price), 0) AS order_total
            FROM orders o
            JOIN company c ON c.id = o.company_id
            JOIN order_items oi ON oi.order_id = o.id
            JOIN items i ON i.id = oi.item_id
            GROUP BY o.id, o.created_at, o.company_id, o.payment_method, o.printed_at, c.name, c.logo
            ORDER BY o.id DESC
            LIMIT $1;
        `;
        const headers = await pool.query(headerQuery, [Math.min(parseInt(limit, 10) || 20, 50)]);

        if (headers.rows.length === 0) {
            return res.status(200).json({
                success: true,
                data: mockOrders.map(withTotals),
                isDemoData: true
            });
        }

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
            data,
            isDemoData: false
        });
    } catch (err) {
        console.warn("Receipt list failed, using mock data:", err.message);
        return res.status(200).json({
            success: true,
            data: mockOrders.map(withTotals),
            isDemoData: true
        });
    }
};

// GET /api/v1/receipts/:id — full receipt payload for one order
export const getReceiptById = async (req, res) => {
    const { id } = req.params;
    const { demo } = req.query;

    if (demo === "true") {
        const found = mockOrders.find((o) => String(o.id) === String(id));
        if (!found) {
            return res.status(404).json({ success: false, message: "Receipt not found in demo data." });
        }
        return res.status(200).json({ success: true, data: withTotals(found), isDemoData: true });
    }

    try {
        await ready();

        const headerQuery = `
            SELECT
                o.id,
                o.created_at,
                o.company_id,
                COALESCE(o.payment_method, 'CASH') AS payment_method,
                o.printed_at,
                c.name AS company_name,
                NULLIF(c.logo, '') AS company_logo
            FROM orders o
            JOIN company c ON c.id = o.company_id
            WHERE o.id = $1;
        `;
        const headerResult = await pool.query(headerQuery, [id]);

        if (headerResult.rows.length === 0) {
            const mock = mockOrders.find((o) => String(o.id) === String(id));
            if (mock) {
                return res.status(200).json({ success: true, data: withTotals(mock), isDemoData: true });
            }
            return res.status(404).json({ success: false, message: "Order not found." });
        }

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
            data: mapOrderRow(headerResult.rows[0], itemsResult.rows),
            isDemoData: false
        });
    } catch (err) {
        console.warn("Receipt fetch failed:", err.message);
        const mock = mockOrders.find((o) => String(o.id) === String(id)) || mockOrders[0];
        return res.status(200).json({
            success: true,
            data: withTotals(mock),
            isDemoData: true
        });
    }
};

// PATCH /api/v1/receipts/:id/print — record payment method + printed timestamp
export const markReceiptPrinted = async (req, res) => {
    const { id } = req.params;
    const paymentMethod = (req.body?.payment_method || "CASH").toUpperCase();

    if (!["CASH", "CARD"].includes(paymentMethod)) {
        return res.status(400).json({
            success: false,
            message: "payment_method must be CASH or CARD."
        });
    }

    try {
        await ready();

        const result = await pool.query(
            `
            UPDATE orders
            SET payment_method = $1,
                printed_at = NOW()
            WHERE id = $2
            RETURNING id, payment_method, printed_at, created_at, company_id;
            `,
            [paymentMethod, id]
        );

        if (result.rows.length === 0) {
            // Demo / missing order — acknowledge so the UI can still print
            return res.status(200).json({
                success: true,
                message: "Print acknowledged (demo / offline mode).",
                data: {
                    id: Number(id),
                    payment_method: paymentMethod,
                    printed_at: new Date().toISOString()
                },
                isDemoData: true
            });
        }

        return res.status(200).json({
            success: true,
            message: "Receipt marked as printed.",
            data: result.rows[0],
            isDemoData: false
        });
    } catch (err) {
        console.warn("Mark printed failed:", err.message);
        return res.status(200).json({
            success: true,
            message: "Print acknowledged (fallback mode).",
            data: {
                id: Number(id),
                payment_method: paymentMethod,
                printed_at: new Date().toISOString()
            },
            isDemoData: true
        });
    }
};
