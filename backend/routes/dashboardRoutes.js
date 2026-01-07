const express = require("express");
const { getDashboardStats, getAllBookings } = require("../controllers/dashboardController");
const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/bookings", getAllBookings);

module.exports = router;
