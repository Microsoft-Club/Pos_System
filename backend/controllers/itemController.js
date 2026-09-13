import pool from "../database.js";
import { AppError } from "../utils/error.js";

// 1. Fetch all items from the database
export const getItems = async (req, res, next) => {
    try {
        // Run a SELECT query to get all items from the table
        const queryText = "SELECT * FROM items WHERE company_id = $1 ORDER BY id ASC";
        const result = await pool.query(queryText, [req.user.company_id]);

        // Send the fetched items back to the user
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        next(err);
    }
};

// 2. Add a new item to the database
export const addItem = async (req, res, next) => {
    const { name, price, type } = req.body;
    const company_id = req.user.company_id;

    if (!company_id) {
        throw new AppError("You must belong to a company to add items.", 400);
    }

    if (!name || !price || !type) {
        throw new AppError("Please fill in all fields: name, price, and type.", 400);
    }

    try {
        const queryText = `
            INSERT INTO items (name, price, type, company_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const result = await pool.query(queryText, [name, price, type, company_id]);

        res.status(201).json({
            success: true,
            message: "Item added successfully!",
            data: result.rows[0]
        });
    } catch (err) {
        next(new AppError("Failed to add item due to some error.", 400));
    }
};

// 3. Edit an existing item (handles general details and updating prices)
export const editItem = async (req, res, next) => {
    const { id } = req.params;
    const { name, price, type } = req.body;
    const company_id = req.user.company_id;

    if (!name || !price || !type) {
        throw new AppError("Please fill in all fields: name, price, and type.", 400);
    }

    try {
        const queryText = `
            UPDATE items
            SET name = $1, price = $2, type = $3
            WHERE id = $4 AND company_id = $5
            RETURNING *;
        `;

        const result = await pool.query(queryText, [name, price, type, id, company_id]);

        if (result.rowCount === 0) {
            throw new AppError("Item not found.", 404);
        }

        res.status(200).json({
            success: true,
            message: "Item updated successfully!",
            data: result.rows[0]
        });
    } catch (err) {
        if (err instanceof AppError) return next(err);
        next(new AppError("Failed to edit item due to some error.", 500));
    }
};

// 4. Delete an item from the database
export const deleteItem = async (req, res, next) => {
    const { id } = req.params;
    const company_id = req.user.company_id;

    try {
        const queryText = "DELETE FROM items WHERE id = $1 AND company_id = $2 RETURNING *;";
        const result = await pool.query(queryText, [id, company_id]);

        if (result.rowCount === 0) {
            throw new AppError("Item not found.", 404);
        }

        res.status(200).json({
            success: true,
            message: "Item deleted successfully!",
            data: result.rows[0]
        });
    } catch (err) {
        if (err instanceof AppError) return next(err);
        next(new AppError("Failed to delete item due to some error.", 500));
    }
};
