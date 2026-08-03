import express from "express";
import dashboardRouter from "./routes/dashboard.js";
import itemRouter from "./routes/items.js";

const app = express();

// Custom CORS middleware to avoid external dependencies
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// API Routes
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/items", itemRouter);

export default app;