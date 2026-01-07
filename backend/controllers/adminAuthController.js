import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔍 Debug log (correct)
    console.log("ADMIN LOGIN USER:", {
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      typeofIsAdmin: typeof user.isAdmin,
    });

    // ✅ STRICT ADMIN CHECK
    if (user.role !== "admin" && user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access denied" });
    }

    const token = jwt.sign(
      { id: user._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ THIS IS THE MISSING PART
    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: "admin",
        isAdmin: true,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
