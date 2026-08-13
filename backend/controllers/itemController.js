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
    // Destructure the item details from the request body
    const { name, price, type, company_id } = req.body;

    // Basic validation to check if all required fields are provided
    if (!name || !price || !type || !company_id) {
        throw new AppError("Please fill in all fields: name, price, type, and company_id.", 400);
    }

    try {
        // SQL query to insert the new item. We return the inserted row using RETURNING *
        const queryText = `
            INSERT INTO items (name, price, type, company_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        
        // Run the query safely using parameterized inputs to prevent SQL Injection
        const result = await pool.query(queryText, [name, price, type, company_id]);

        // Send back the newly created item with a 201 Created status
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
    // Get the ID from the URL parameters
    const { id } = req.params;
    
    // Get the updated values from the request body
    const { name, price, type } = req.body;

    // Simple validation to check if all updated details are provided
    if (!name || !price || !type) {
        throw new AppError("Please fill in all fields: name, price, and type.", 500);
    }

    try {
        // Run the SQL query to update the item
        const queryText = `
            UPDATE items
            SET name = $1, price = $2, type = $3
            WHERE id = $4
            RETURNING *;
        `;
        
        // Execute the query safely using parameterized queries
        const result = await pool.query(queryText, [name, price, type, id]);

        // If rowCount is 0, it means no item was found with that ID to update
        if (result.rowCount === 0) {
            throw new AppError("Item not found.", 404);
        }

        // Send back the updated item details
        res.status(200).json({
            success: true,
            message: "Item updated successfully!",
            data: result.rows[0]
        });
    } catch (err) {
        next(new AppError("Failed to edit item due to some error.", 500));
    }
};

// 4. Delete an item from the database
export const deleteItem = async (req, res) => {
    // Get the ID from the URL parameters
    const { id } = req.params;

    try {
        // Run the SQL query to delete the item from the items table
        const queryText = "DELETE FROM items WHERE id = $1 RETURNING *;";
        
        // Execute the query safely
        const result = await pool.query(queryText, [id]);

        // If rowCount is 0, it means no item was found with that ID to delete
        if (result.rowCount === 0) {
            throw new AppError("Item not found.", 404);
        }

        // Respond with success and return the deleted item data
        res.status(200).json({
            success: true,
            message: "Item deleted successfully!",
            data: result.rows[0]
        });
    } catch (err) {
        next(new AppError("Failed to delete item due to some error.", 500));
    }
};
