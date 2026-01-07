import express from "express";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMyBookings,
  changePassword,
} from "../controllers/userController.js";
import User from "../models/User.js";

const router = express.Router();

/* =======================
   LOGGED-IN USER ROUTES
======================= */

// Logged-in user info
router.get("/me", verifyUser, (req, res) => {
  res.json(req.user);
});

// Update profile
router.put("/update-profile", verifyUser, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User bookings
router.get("/my-bookings", verifyUser, getMyBookings);

// Change password
router.put("/change-password", verifyUser, changePassword);

/* =======================
   ADMIN ROUTES (SECURED)
======================= */

// Get all users (ADMIN ONLY)
router.get("/", verifyUser, verifyAdmin, getUsers);

// Get user by ID
router.get("/:id", verifyUser, verifyAdmin, getUserById);

// Create user
router.post("/", verifyUser, verifyAdmin, createUser);

// Update user
router.put("/:id", verifyUser, verifyAdmin, updateUser);

// Delete user
router.delete("/:id", verifyUser, verifyAdmin, deleteUser);

export default router;
