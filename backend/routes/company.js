import express from "express";
import { createCompany, addMember, getMyCompany, upload, removeMember, getMemberAnalytics } from "../controllers/companyController.js";
import { protect, authorize } from "../controllers/authController.js";

const router = express.Router();

// GET /api/v1/company — current user's company
router.get("/", protect, getMyCompany);

// POST /api/v1/company — create company (logged-in user becomes MASTER_ADMIN)
router.post("/", protect, upload.single("logo"), createCompany);

// POST /api/v1/company/members — add existing user as OWNER or CASHIER
router.post("/members", protect, authorize(["MASTER_ADMIN"]), addMember);
router.delete("/members", protect, authorize(["MASTER_ADMIN"]), removeMember);
router.get("/analytics/:timeline", protect, authorize(["MASTER_ADMIN"]), getMemberAnalytics);

export default router;
