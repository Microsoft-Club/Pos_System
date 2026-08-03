import pool from "../database.js";

// In-memory mock database for fallback/demo mode when PostgreSQL connection fails.
// This matches the teammate's pattern in dashboardController.js so the UI doesn't crash.
let mockItems = [
    { id: 1, name: "Half Chicken Biryani", price: 320.00, type: "HALF", company_id: 1 },
    { id: 2, name: "Full Chicken Biryani", price: 520.00, type: "FULL", company_id: 1 },
    { id: 3, name: "Family Pack Biryani", price: 1450.00, type: "FAMILY", company_id: 1 },
    { id: 4, name: "Raita", price: 50.00, type: "HALF", company_id: 1 },
    { id: 5, name: "Salad", price: 50.00, type: "HALF", company_id: 1 }
];
let nextId = 6;

// 1. Fetch all items from the database
export const getItems = async (req, res) => {
    try {
        // Run a SELECT query to get all items from the table
        const queryText = "SELECT * FROM items ORDER BY id ASC";
        const result = await pool.query(queryText);

        // Send the fetched items back to the user
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        // If database connection fails, fall back to mock data
        console.warn("Database connection failed, falling back to mock data:", err.message);
        
        res.status(200).json({
            success: true,
            data: mockItems,
            isDemoData: true
        });
    }
};

// 2. Add a new item to the database
export const addItem = async (req, res) => {
    // Destructure the item details from the request body
    const { name, price, type, company_id } = req.body;

    // Basic validation to check if all required fields are provided
    if (!name || !price || !type || !company_id) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all fields: name, price, type, and company_id."
        });
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
        // If database fails, fall back to adding it to in-memory mock database
        console.warn("Database connection failed, adding to in-memory mock data:", err.message);

        const newMockItem = {
            id: nextId++,
            name,
            price: parseFloat(price),
            type,
            company_id: parseInt(company_id)
        };
        mockItems.push(newMockItem);

        res.status(201).json({
            success: true,
            message: "Item added successfully (Demo Mode)!",
            data: newMockItem,
            isDemoData: true
        });
    }
};

// 3. Edit an existing item (handles general details and updating prices)
export const editItem = async (req, res) => {
    // Get the ID from the URL parameters
    const { id } = req.params;
    
    // Get the updated values from the request body
    const { name, price, type } = req.body;

    // Simple validation to check if all updated details are provided
    if (!name || !price || !type) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all fields: name, price, and type."
        });
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
            return res.status(404).json({
                success: false,
                message: "Item not found."
            });
        }

        // Send back the updated item details
        res.status(200).json({
            success: true,
            message: "Item updated successfully!",
            data: result.rows[0]
        });
    } catch (err) {
        // If database fails, fall back to updating in-memory mock database
        console.warn("Database connection failed, updating in-memory mock data:", err.message);

        const itemId = parseInt(id);
        const itemIndex = mockItems.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            });
        }

        mockItems[itemIndex] = {
            ...mockItems[itemIndex],
            name,
            price: parseFloat(price),
            type
        };

        res.status(200).json({
            success: true,
            message: "Item updated successfully (Demo Mode)!",
            data: mockItems[itemIndex],
            isDemoData: true
        });
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
            return res.status(404).json({
                success: false,
                message: "Item not found."
            });
        }

        // Respond with success and return the deleted item data
        res.status(200).json({
            success: true,
            message: "Item deleted successfully!",
            data: result.rows[0]
        });
    } catch (err) {
        // If database fails, fall back to deleting from in-memory mock database
        console.warn("Database connection failed, deleting from in-memory mock data:", err.message);

        const itemId = parseInt(id);
        const itemIndex = mockItems.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            });
        }

        const deletedItem = mockItems[itemIndex];
        mockItems = mockItems.filter(item => item.id !== itemId);

        res.status(200).json({
            success: true,
            message: "Item deleted successfully (Demo Mode)!",
            data: deletedItem,
            isDemoData: true
        });
    }
};
