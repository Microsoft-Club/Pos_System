import express from "express";
import { getItems, addItem, editItem, deleteItem } from "../controllers/itemController.js";
import { authorize, protect } from "../controllers/authController.js";

const router = express.Router();

// Define all the API routes 

// 1. GET /api/v1/items - View all menu items
router.get("/", protect, authorize(['MASTER_ADMIN']), getItems);

// 2. POST /api/v1/items - Add a new menu item
router.post("/", protect, authorize(['MASTER_ADMIN']), addItem);

// 3. PUT /api/v1/items/:id - Edit an item's details (including price) by its ID
router.put("/:id", protect, authorize(['MASTER_ADMIN']), editItem);

// 4. DELETE /api/v1/items/:id - Delete an item from the menu by its ID
router.delete("/:id", protect, authorize(['MASTER_ADMIN']), deleteItem);


export default router;
