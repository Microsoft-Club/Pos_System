import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { authorize, protect } from "../controllers/authController.js";

const router = express.Router();

router.get("/stats", protect, authorize(['MASTER_ADMIN', 'OWNER']), getDashboardStats);

export default router;
