import pool from "../database.js";
import { AppError } from "../utils/error.js";

// Create a company — creator becomes MASTER_ADMIN
export const createCompany = async (req, res) => {
    const { name, email, logo } = req.body;
    const user = req.user;

    if (!name || !email || !logo) {
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
            [name, logo, email, user.id]
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
        await client.query("ROLLBACK");
        if (err instanceof AppError) throw err;
        throw new AppError("Something went wrong while creating the company.", 500);
    } finally {
        client.release();
    }
};

// Add an existing user to the company as OWNER or CASHIER
export const addMember = async (req, res) => {
    const { email, role } = req.body;
    const admin = req.user;

    if (!email || !role) {
        throw new AppError("Please provide member email and role.", 400);
    }

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
        if (err instanceof AppError) throw err;
        throw new AppError("Something went wrong while adding the member.", 500);
    }
};
