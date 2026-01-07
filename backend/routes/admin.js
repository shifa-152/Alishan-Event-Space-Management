// backend/routes/admin.js
import express from "express";
import User from "../models/User.js";
import { verifyAdmin } from "../middleware/auth.js"; // middleware to protect admin routes

const router = express.Router();

// GET all users
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;
