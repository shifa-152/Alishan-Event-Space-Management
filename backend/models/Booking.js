import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // User basic details (captured at booking time)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Relations
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },

    // Booking details
    eventDate: {
      type: Date,
      required: true,
    },

    slot: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    paymentType: {
      type: String,
      enum: ["cash", "upi", "card", "online"],
      default: "online",
    },
paymentStatus: {
  type: String,
  enum: ["advance", "full"],
  default: "advance",
},
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "visited", "not_visited","cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Index for faster user booking queries
bookingSchema.index({ user: 1, eventDate: -1 });

// ✅ Create model safely (prevents overwrite errors)
const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
