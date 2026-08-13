import pool from "../database.js";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { AppError } from "../utils/error.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(path.dirname(fileURLToPath(import.meta.url)), "../logos"));
    },
    filename: (req, file, cb) => {
        cb(null, req.user.email + '-logo.jpeg');
    }
});

export const upload = multer({
    storage,

    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith("image/"))
            cb(null, true);
        else 
            cb(new AppError("Only image files are allowed.", 400));
    },

    limits: {
        fileSize: 1024 * 1024
    }
});

// Create a company — creator becomes MASTER_ADMIN
export const createCompany = async (req, res, next) => {
    const { name, email } = req.body;
    const { filename } = req.file;
    const user = req.user;

    if (!name || !email || !filename) {
        throw new AppError("Please provide company name, email, and logo.", 400);
    }

    if (user.company_id) {
        throw new AppError("You already belong to a company.", 400);
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const companyResult = await client.query(
            `INSERT INTO company (name, logo, email, master_admin)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, logo, email, master_admin;`,
            [name, filename, email, user.id]
        );

        const company = companyResult.rows[0];

        const userResult = await client.query(
            `UPDATE users
             SET company_id = $1, company_role = 'MASTER_ADMIN'
             WHERE id = $2
             RETURNING id, name, email, company_role, company_id;`,
            [company.id, user.id]
        );

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            message: "Company created successfully!",
            data: {
                company,
                user: userResult.rows[0],
            },
        });
    } catch (err) {
        next(err);
    } finally {
        client.release();
    }
};

// GET current user's company (includes logo filename)
export const getMyCompany = async (req, res, next) => {
    try {
        if (!req.user.company_id) {
            throw new AppError("You do not belong to a company yet.", 404);
        }

        const result = await pool.query(
            `SELECT id, name, logo, email, master_admin
             FROM company
             WHERE id = $1`,
            [req.user.company_id]
        );

        if (result.rowCount === 0) {
            throw new AppError("Company not found.", 404);
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    } catch (err) {
        next(err);
    }
};

// Add an existing user to the company as OWNER or CASHIER
export const addMember = async (req, res, next) => {
    const { email, role } = req.body;
    const admin = req.user;

    if (!email || !role) {
        throw new AppError("Please provide member email and role.", 400);
    }

    if(email === req.user.email)
        throw new AppError("You can't add yourself.", 400);

    if (!["OWNER", "CASHIER"].includes(role)) {
        throw new AppError("Role must be OWNER or CASHIER.", 400);
    }

    if (!admin.company_id) {
        throw new AppError("You must belong to a company to add members.", 400);
    }

    try {
        const memberResult = await pool.query(
            "SELECT id, name, email, company_id, company_role FROM users WHERE email = $1",
            [email]
        );

        if (memberResult.rowCount === 0) {
            throw new AppError("No user found with that email.", 404);
        }

        const member = memberResult.rows[0];

        if (member.company_id) {
            throw new AppError("That user already belongs to a company.", 400);
        }

        const updated = await pool.query(
            `UPDATE users
             SET company_id = $1, company_role = $2
             WHERE id = $3
             RETURNING id, name, email, company_role, company_id;`,
            [admin.company_id, role, member.id]
        );

        res.status(200).json({
            success: true,
            message: "Member added to company successfully!",
            data: updated.rows[0],
        });
    } catch (err) {
        next(err);
    }
};


export const removeMember = async(req, res, next) => {
    try{
        const {email, role} = req.body;

        if(!email || !role)
            throw new AppError("Please provide email and role of the member.", 400);

        if(email === req.user.email)
            throw new AppError("You can't remove yourself.", 400);

        if(!['OWNER', 'CASHIER'].includes(role))
            throw new AppError("Role can be either cashier or owner.", 400);

        const client = await pool.connect();

        try{
            await client.query("BEGIN");

            const id = (await client.query("UPDATE users SET company_id = NULL, company_role = NULL WHERE email = $1 AND company_id = $2 AND company_role = $3 RETURNING id;", [email, req.user.company_id, role])).rowCount;

            if(!id) throw new AppError("No such member found.", 404);

            await client.query("UPDATE orders SET created_by = NULL WHERE company_id = $1 AND created_by = $2;", [req.user.company_id, id]);

            await client.query("COMMIT");
        } catch(err){
            await client.query("ROLLBACK");
        }

        res.status(204).send({
            status: 'success'
        })
    } catch(err){
        next(err);
    }
}

export const getMemberAnalytics = async(req, res, next) => {
    try{
        const {period} = req.query;

        if(!period)
            throw new AppError("Please provide a period.", 400);

        if(!['daily', 'monthly', 'yearly', 'all'].includes(period))
            throw new AppError("Please provide a valid period.", 400);

        const mapping = {
            'daily': 1,
            'monthly': 30,
            'yearly': 365,
            'all': 0,
        }

        let analytics = (await pool.query(`
            SELECT 
                u.id,
                u.name,
                json_agg(
                    json_build_object(
                        'order_id', o.id,
                        'created_at', o.created_at,
                        'subtotal', o.subtotal,
                        'discount_rate', o.discount_rate,
                        'discount_amount', o.discount_amount,
                        'tax_amount', o.tax_amount,
                        'total', o.total
                    )
                ) AS orders_per_member,
                json_agg(
                    json_build_object(
                        'order_id', o.id,
                        'item_id', i.id,
                        'item_name', i.name
                    )
                ) AS items_per_order
            FROM (SELECT * FROM users WHERE company_id = $1) u 
            LEFT JOIN orders o ON o.company_id = u.company_id
            JOIN order_items oi ON o.id = oi.order_id
            JOIN items i on i.id = oi.item_id
            ${period !== 'all' ? "WHERE o.created_at >= NOW() - ($2 * INTERVAL '1 day')" : ''}
            GROUP BY u.id, u.name;
        `, [req.user.company_id, mapping[period]])).rows;

        analytics = analytics?.map(analytic => {
            analytic.orders_per_member = analytic.orders_per_member.map(order => {
                const items = analytic.items_per_order.filter(i => i.order_id === order.order_id);

                order = {...order, items};

                return order;
            });

            delete analytic.items_per_order;
            return analytic;
        })

        res.status(200).send({
            status: 'success',
            data: {
                analytics
            }
        })
    } catch(err){
        next(err);
    }
}