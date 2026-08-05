import express from "express";
import {
    getRecentReceipts,
    getReceiptById,
    markReceiptPrinted
} from "../controllers/receiptController.js";

const router = express.Router();

router.get("/", getRecentReceipts);
router.get("/:id", getReceiptById);
router.patch("/:id/print", markReceiptPrinted);

export default router;
