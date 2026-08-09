import express from "express";
import {
    getRecentReceipts,
    getReceiptById,
    markReceiptPrinted
} from "../controllers/receiptController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.get("/", protect, getRecentReceipts);
router.get("/:id", protect, getReceiptById);
router.patch("/:id/print", protect, markReceiptPrinted);

export default router;
