import pool from "../database.js";

const seed = async () => {
    console.log("Starting database seeding...");
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Clear existing data (in reverse order of dependencies)
        console.log("Cleaning existing tables...");
        await client.query("DELETE FROM order_items");
        await client.query("DELETE FROM orders");
        await client.query("DELETE FROM items");
        
        // Remove circular reference temporarily to clean users and company
        await client.query("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_company_id_fkey");
        await client.query("DELETE FROM company");
        await client.query("DELETE FROM users");

        // Re-add the constraint
        await client.query("ALTER TABLE users ADD CONSTRAINT users_company_id_fkey FOREIGN KEY(company_id) REFERENCES company(id)");

        console.log("Seeding User & Company...");
        // 1. Insert User (with null company_id first)
        const userRes = await client.query(`
            INSERT INTO users (name, email, password, company_role, company_id)
            VALUES ($1, $2, $3, $4, NULL)
            RETURNING id;
        `, ["Saadia", "saadia@possystem.com", "admin123", "OWNER"]);
        const userId = userRes.rows[0].id;

        // 2. Insert Company
        const companyRes = await client.query(`
            INSERT INTO company (name, logo, email, master_admin)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `, ["Biryani Junction", "", "info@biryanijunction.com", userId]);
        const companyId = companyRes.rows[0].id;

        // 3. Update User's company_id
        await client.query(`
            UPDATE users SET company_id = $1 WHERE id = $2;
        `, [companyId, userId]);

        console.log("Seeding Menu Items...");
        // 4. Insert Items
        const items = [
            { name: "Half Chicken Biryani", price: 320.00, type: "HALF" },
            { name: "Full Chicken Biryani", price: 520.00, type: "FULL" },
            { name: "Family Pack Biryani", price: 1450.00, type: "FAMILY" },
            { name: "Half Beef Biryani", price: 380.00, type: "HALF" },
            { name: "Full Beef Biryani", price: 580.00, type: "FULL" },
            { name: "Raita", price: 50.00, type: "HALF" },
            { name: "Salad", price: 50.00, type: "HALF" },
            { name: "Coke 1.5L", price: 150.00, type: "FAMILY" }
        ];

        const itemIds = {};
        for (const item of items) {
            const res = await client.query(`
                INSERT INTO items (name, price, type, company_id)
                VALUES ($1, $2, $3, $4)
                RETURNING id, name;
            `, [item.name, item.price, item.type, companyId]);
            itemIds[item.name] = res.rows[0].id;
        }

        console.log("Seeding Orders and Order Items...");
        // 5. Seed orders for the last 7 days (including today)
        const itemPrices = {
            "Half Chicken Biryani": 320.00,
            "Full Chicken Biryani": 520.00,
            "Family Pack Biryani": 1450.00,
            "Half Beef Biryani": 380.00,
            "Full Beef Biryani": 580.00,
            "Raita": 50.00,
            "Salad": 50.00,
            "Coke 1.5L": 150.00
        };

        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const orderDate = new Date(today);
            orderDate.setDate(today.getDate() - i);
            const dateStr = orderDate.toISOString().split("T")[0]; // YYYY-MM-DD

            // Generate a random number of orders per day (between 8 and 18, higher on weekends)
            const dayOfWeek = orderDate.getDay();
            const numOrders = (dayOfWeek === 0 || dayOfWeek === 6) ? 18 : 10;

            for (let j = 0; j < numOrders; j++) {
                const orderRes = await client.query(`
                    INSERT INTO orders (created_at, company_id)
                    VALUES ($1, $2)
                    RETURNING id;
                `, [dateStr, companyId]);
                const orderId = orderRes.rows[0].id;

                // Pick a few random items to add to this order
                const selectedItems = [];
                // Ensure every order has at least one Biryani
                const biryanis = [
                    "Half Chicken Biryani", 
                    "Full Chicken Biryani", 
                    "Family Pack Biryani", 
                    "Half Beef Biryani", 
                    "Full Beef Biryani"
                ];
                const primaryBiryani = biryanis[Math.floor(Math.random() * biryanis.length)];
                selectedItems.push({
                    id: itemIds[primaryBiryani],
                    name: primaryBiryani,
                    qty: Math.floor(Math.random() * 3) + 1
                });

                // 50% chance of adding Raita
                if (Math.random() > 0.5) {
                    selectedItems.push({
                        id: itemIds["Raita"],
                        name: "Raita",
                        qty: Math.floor(Math.random() * 2) + 1
                    });
                }
                
                // 40% chance of adding Salad
                if (Math.random() > 0.6) {
                    selectedItems.push({
                        id: itemIds["Salad"],
                        name: "Salad",
                        qty: Math.floor(Math.random() * 2) + 1
                    });
                }

                // 30% chance of adding Coke
                if (Math.random() > 0.7) {
                    selectedItems.push({
                        id: itemIds["Coke 1.5L"],
                        name: "Coke 1.5L",
                        qty: 1
                    });
                }

                // Insert into order_items
                for (const sel of selectedItems) {
                    await client.query(`
                        INSERT INTO order_items (order_id, item_id, quantity)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (order_id, item_id) DO NOTHING;
                    `, [orderId, sel.id, sel.qty]);
                }
            }
        }

        await client.query("COMMIT");
        console.log("Database successfully seeded!");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Seeding failed: ", error);
    } finally {
        client.release();
        await pool.end();
    }
};

seed();
