const Booking = require("../models/Booking");

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const total = await Booking.countDocuments();

    // case-insensitive check
    const pending = await Booking.countDocuments({
      status: { $regex: /^pending$/i }
    });

    const approved = await Booking.countDocuments({
      status: { $regex: /^(approved|confirmed)$/i }
    });

    res.json({
      totalBookings: total,
      pending,
      approved
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
