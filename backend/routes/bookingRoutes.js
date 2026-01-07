
import express from "express";
import Booking from "../models/Booking.js";
import {
  getPricing,
  getSlots,
  createBooking,
  getAdminBookings,
  getAdminStats,
  updateBookingStatus,
  receivePayment,
  updatePaymentStatus,
} from "../controllers/bookingController.js";

import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==================================
   USER BOOKING FLOW
================================== */

// Pricing & slots (public)
router.get("/pricing", getPricing);
router.get("/slots", getSlots);

// Create booking
router.post("/", verifyUser, createBooking);

// Get logged-in user's bookings
router.get("/my", verifyUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("hall", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error("My bookings error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Cancel booking (USER)
router.put("/cancel/:id", verifyUser, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });

    if (booking.status !== "pending")
      return res
        .status(400)
        .json({ error: "Only pending bookings can be cancelled" });

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ==================================
   ADMIN FLOW
================================== */

// Admin stats
router.get(
  "/admin/stats",
  verifyUser,
  verifyAdmin,
  getAdminStats
);

// Get all bookings (admin)
router.get(
  "/admin/bookings",
  verifyUser,
  verifyAdmin,
  getAdminBookings
);

// Update booking status (admin)
router.put(
  "/:id/status",
  verifyUser,
  verifyAdmin,
  updateBookingStatus
);

// Update payment (admin)
router.put(
  "/:id/payment",
  verifyUser,
  verifyAdmin,
  updatePaymentStatus
);

// Receive remaining payment (admin)
router.put(
  "/:id/receive-payment",
  verifyUser,
  verifyAdmin,
  receivePayment
);


export default router;
