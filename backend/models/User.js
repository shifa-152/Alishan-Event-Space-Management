import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },

    password: { type: String }, // optional for OTP users

    authType: {
      type: String,
      enum: ["password", "otp"],
      default: "otp"
    },

    otp: String,
    otpExpires: Date,

    // ✅ ADD THESE
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
