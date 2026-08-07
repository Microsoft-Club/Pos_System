import express from "express";
import cookieParser from "cookie-parser";
import dashboardRouter from "./routes/dashboard.js";
import itemRouter from "./routes/items.js";
<<<<<<< HEAD
import receiptRouter from "./routes/receipts.js";
=======
import authRouter from "./routes/auth.js";
>>>>>>> main
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/items", itemRouter);
<<<<<<< HEAD
app.use("/api/v1/receipts", receiptRouter);
=======
app.use("/api/v1/auth", authRouter);
>>>>>>> main

export default app;