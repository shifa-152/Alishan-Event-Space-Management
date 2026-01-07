import express from "express";
import { registerUser, loginUser } from "../controllers/passwordAuthController.js";
import { sendOtp, verifyOtp } from "../controllers/userAuthController.js";
import { adminLogin } from "../controllers/adminAuthController.js";

const router = express.Router();

// Password auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// OTP auth
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Admin
router.post("/admin/login", adminLogin);

export default router;
