import express from "express";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Example admin route
router.get("/dashboard", verifyUser, verifyAdmin, (req, res) => {
  res.send("Hello Admin, welcome to your dashboard!");
});

// Another example: view all users (admin only)
router.get("/users", verifyUser, verifyAdmin, (req, res) => {
  res.send("This route is accessible only by admins");
});
router.get("/admin/stats", verifyAdmin, async (req, res) => {
  const stats = {
    total: await Booking.countDocuments(),
    pending: await Booking.countDocuments({ status: "pending" }),
    approved: await Booking.countDocuments({ status: "approved" }),
    rejected: await Booking.countDocuments({ status: "rejected" }),
  };
  res.json(stats);
});

export default router;
