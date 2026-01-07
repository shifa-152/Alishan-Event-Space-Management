// import Booking from "../models/Booking.js";
// import Hall from "../models/Hall.js";

// /* ----------------------------------
//    GET PRICE
// ----------------------------------- */
// export const getPricing = async (req, res) => {
//   try {
//     const { hallId, duration } = req.query;

//     if (!hallId || !duration) {
//       return res.json({
//         success: false,
//         message: "Hall ID and duration required",
//       });
//     }

//     const hall = await Hall.findById(hallId);
//     if (!hall) {
//       return res.json({ success: false, message: "Hall not found" });
//     }

//     let price = 0;
//     if (duration === "1h" || duration === "1 hour") price = hall.price1hr;
//     if (duration === "2h" || duration === "2 hours") price = hall.price2hr;

//     res.json({ success: true, price: Number(price) });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ----------------------------------
//    GET SLOTS
// ----------------------------------- */
// export const getSlots = async (req, res) => {
//   try {
//     const { hall, date, duration } = req.query;

//     const ONE_HOUR_SLOTS = [
//       "10:00 - 11:00",
//       "11:00 - 12:00",
//       "12:00 - 13:00",
//       "13:00 - 14:00",
//       "15:00 - 16:00",
//       "16:00 - 17:00",
//       "17:00 - 18:00",
//       "18:00 - 19:00",
//     ];

//     const TWO_HOUR_SLOTS = [
//       "10:00 - 12:00",
//       "12:00 - 14:00",
//       "15:00 - 17:00",
//       "17:00 - 19:00",
//     ];

//     const slots =
//       duration.includes("2") ? TWO_HOUR_SLOTS : ONE_HOUR_SLOTS;

//     const bookings = await Booking.find({
//       hall,
//       eventDate: new Date(date),
//       status: { $ne: "rejected" },
//     });

//     const bookedSlots = bookings.map((b) => b.slot);

//     res.json({
//       success: true,
//       data: slots.map((slot) => ({
//         slot,
//         status: bookedSlots.includes(slot) ? "booked" : "available",
//       })),
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ----------------------------------
//    CREATE BOOKING
// ----------------------------------- */
// export const createBooking = async (req, res) => {
//   try {
//     if (!req.user || !req.user._id) 
//       return res.status(401).json({ success: false, message: "Unauthorized" });

//     const { name, phone, hall, eventDate, slot, price, payType, paymentMethod } = req.body;
//     const amountPaid = payType === "advance" ? Math.ceil(price / 2) : price;

//     const booking = await Booking.create({
//       user: req.user._id,
//       name,
//       phone,
//       hall,
//       eventDate,
//       slot,
//       price,
//       amountPaid,
//        paymentType: paymentType || "cash",
//   paymentStatus: paymentStatus || "advance",
//       status: "pending",
//     });

//     req.io.emit("updateSlots", { hall, date: eventDate });

//     res.json({ success: true, booking });
//   } catch (err) {
//     console.error("Booking creation error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



// /* ----------------------------------
//    ADMIN BOOKINGS
// ----------------------------------- */
// export const getAdminBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("hall", "name", "name phone email")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, data: bookings });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
// // PUT /api/booking/:id/receive-payment
// export const receivePayment = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     booking.amountPaid = booking.price; // Mark full payment
//     await booking.save();

//     res.json({ message: "Payment received", booking });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ----------------------------------
//    UPDATE STATUS
// ----------------------------------- */
// export const updateBookingStatus = async (req, res) => {
//   try {
//     await Booking.findByIdAndUpdate(req.params.id, {
//       status: req.body.status.toLowerCase(),
//     });

//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ success: false });
//   }
// };
// // GET /api/booking/admin/stats
// export const getAdminStats = async (req, res) => {
//   try {
//     // Total bookings
//     const totalBookings = await Booking.countDocuments();

//     // Pending bookings (status: "pending")
//     const pendingBookings = await Booking.countDocuments({ status: "pending" });

//     // Total users
//     const totalUsers = await User.countDocuments();

//     // Example: you can also add total halls if you have a Hall model
//     // const totalHalls = await Hall.countDocuments();

//     res.json({
//       totalBookings,
//       pendingBookings,
//       totalUsers,
//       // totalHalls
//     });
//   } catch (error) {
//     console.error("Error fetching admin stats:", error);
//     res.status(500).json({ message: "Server error fetching stats" });
//   }
// };
import Booking from "../models/Booking.js";
import Hall from "../models/Hall.js";
import User from "../models/User.js";

/* ----------------------------------
   GET PRICING
----------------------------------- */
export const getPricing = async (req, res) => {
  try {
    const { hallId, duration } = req.query;
    if (!hallId || !duration)
      return res.json({ success: false, message: "Hall ID and duration required" });

    const hall = await Hall.findById(hallId);
    if (!hall) return res.json({ success: false, message: "Hall not found" });

    let price = 0;
    if (duration.includes("1")) price = hall.price1hr;
    if (duration.includes("2")) price = hall.price2hr;

    res.json({ success: true, price: Number(price) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ----------------------------------
   GET SLOTS
----------------------------------- */
export const getSlots = async (req, res) => {
  try {
    const { hall, date, duration } = req.query;

    const ONE_HOUR_SLOTS = ["10:00 - 11:00","11:00 - 12:00","12:00 - 13:00","13:00 - 14:00","15:00 - 16:00","16:00 - 17:00","17:00 - 18:00","18:00 - 19:00"];
    const TWO_HOUR_SLOTS = ["10:00 - 12:00","12:00 - 14:00","15:00 - 17:00","17:00 - 19:00"];

    const slots = duration.includes("2") ? TWO_HOUR_SLOTS : ONE_HOUR_SLOTS;

    const bookings = await Booking.find({
      hall,
      eventDate: new Date(date),
      status: { $ne: "rejected" },
    });

    const bookedSlots = bookings.map((b) => b.slot);

    res.json({
      success: true,
      data: slots.map((slot) => ({
        slot,
        status: bookedSlots.includes(slot) ? "booked" : "available",
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ----------------------------------
   CREATE BOOKING
----------------------------------- */
export const createBooking = async (req, res) => {
  try {
    if (!req.user || !req.user._id)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const {
      name,
      phone,
      hall,
      eventDate,
      slot,
      price,
      paymentType,
      payType,
    } = req.body;

    const amountPaid = payType === "advance" ? Math.ceil(price / 2) : price;

    const booking = await Booking.create({
      user: req.user._id,
      name,
      phone,
      hall,
      eventDate,
      slot,
      price,
      amountPaid,
      paymentType: paymentType || "cash",
      paymentStatus: payType === "advance" ? "advance" : "full",
      status: "pending",
    });

    req.io?.emit("updateSlots", { hall, date: eventDate });

    res.json({ success: true, booking });
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ----------------------------------
   ADMIN BOOKINGS
----------------------------------- */
export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("hall", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ----------------------------------
   RECEIVE REMAINING PAYMENT
----------------------------------- */
export const receivePayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.amountPaid = booking.price; // Mark as fully paid
    booking.paymentStatus = "full";
    await booking.save();

    res.json({ success: true, message: "Payment received", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------
   UPDATE STATUS
----------------------------------- */
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status.toLowerCase() },
      { new: true }
    );
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* ----------------------------------
   UPDATE PAYMENT STATUS (generic)
----------------------------------- */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, amountPaid } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, amountPaid },
      { new: true }
    );
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* ----------------------------------
   ADMIN STATS
----------------------------------- */
export const getAdminStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const totalUsers = await User.countDocuments();

    res.json({ totalBookings, pendingBookings, totalUsers });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};
