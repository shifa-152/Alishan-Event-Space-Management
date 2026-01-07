import express from "express";
import {
  getHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
} from "../controllers/hallController.js";

const router = express.Router();

// Routes
router.get("/", getHalls);          // Get all halls
router.get("/:id", getHallById);    // Get hall by ID
router.post("/", createHall);       // Create new hall
router.put("/:id", updateHall);     // Update hall by ID
router.delete("/:id", deleteHall);  // Delete hall by ID

export default router;
