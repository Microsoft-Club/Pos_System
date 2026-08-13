import express from "express";
import {
    getRecentReceipts,
    getReceiptById,
    markReceiptPrinted
} from "../controllers/receiptController.js";
import { authorize, protect } from "../controllers/authController.js";

const router = express.Router();

router.get("/", protect, authorize(['MASTER_ADMIN', 'CASHIER']), getRecentReceipts);
router.get("/:id", protect, authorize(['MASTER_ADMIN', 'CASHIER']), getReceiptById);
router.patch("/:id/print", protect, authorize(['MASTER_ADMIN', 'CASHIER']), markReceiptPrinted);

export default router;
