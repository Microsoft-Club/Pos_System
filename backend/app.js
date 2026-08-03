import express from "express";
import dashboardRouter from "./routes/dashboard.js";
import itemRouter from "./routes/items.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

app.use(express.json());

// API Routes
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/items", itemRouter);

export default app;