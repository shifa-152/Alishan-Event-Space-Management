import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendEmail from "../emailService.js";
import sendSmsOtp from "../utils/sendSmsOtp.js";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const createToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

export const sendOtp = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: "Identifier required" });
    }

    const otp = generateOtp();
    await Otp.create({ identifier, otp });

    if (identifier.includes("@")) {
      await sendEmail(identifier, "Your OTP", `OTP: ${otp}`);
    } else {
      await sendSmsOtp(identifier, otp);
    }

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP failed" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { identifier, otp, name } = req.body;

    const record = await Otp.findOne({ identifier, otp });
    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({ identifier });
    if (!user) {
      user = await User.create({
        name,
        identifier,
        verified: true
      });
    }

    await Otp.deleteMany({ identifier });

    res.json({
      token: createToken(user),
      user
    });
  } catch (err) {
    res.status(500).json({ message: "OTP verify failed" });
  }
};
