import express from "express";
import { createCompany, addMember } from "../controllers/companyController.js";
import { protect, authorize } from "../controllers/authController.js";

const router = express.Router();

// POST /api/v1/company — create company (logged-in user becomes MASTER_ADMIN)
router.post("/", protect, createCompany);

// POST /api/v1/company/members — add existing user as OWNER or CASHIER
router.post("/members", protect, authorize(["MASTER_ADMIN"]), addMember);

export default router;
