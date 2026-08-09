import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import dashboardRouter from "./routes/dashboard.js";
import itemRouter from "./routes/items.js";
import receiptRouter from "./routes/receipts.js";
import authRouter from "./routes/auth.js";
import companyRouter from "./routes/company.js";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { globalErrorMiddleware } from "./utils/error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100
});
app.use(limiter);

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(morgan("dev"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use("/logos", express.static(path.join(__dirname, "logos")));

// API Routes
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/receipts", receiptRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/company", companyRouter);

app.use(globalErrorMiddleware);

export default app;