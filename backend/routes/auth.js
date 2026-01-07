// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

// =========================
// REGISTER
// =========================
// REGISTER WITH PASSWORD
router.post("/register", async (req, res) => {
  try {
    const { name, identifier, password } = req.body;

    if (!name || !identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: identifier });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: identifier,
      password: hashedPassword, // ✅ HASHED
      authType: "password",
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});


// PASSWORD LOGIN
// PASSWORD LOGIN
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password required" });
    }

    const user = await User.findOne({ email: identifier });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🚨 VERY IMPORTANT
    if (!user.password) {
      return res.status(400).json({
        message: "This account uses OTP login. Please login with OTP or set a password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});



// =========================
// SEND OTP
// =========================
router.post("/send-otp", async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ message: "Identifier is required" });

    const user = await User.findOne({ email: identifier });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP temporarily in DB (or in-memory)
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    console.log(`OTP for ${identifier}:`, otp); // send via SMS/email in production
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Server error during OTP sending" });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { identifier, otp, name } = req.body;

    let user = await User.findOne({ email: identifier });

    if (!user && name) {
      user = await User.create({
        name,
        email: identifier,
        authType: "otp", // ✅ no password at all
      });
    }

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

export default router;
