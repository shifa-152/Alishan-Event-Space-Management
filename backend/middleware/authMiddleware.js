
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const verifyUser = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
// export const verifyAdmin = (req, res, next) => {
//   if (!req.user || req.user.role !== "admin") {
//     return res.status(403).json({
//       success: false,
//       message: "Admin access only",
//     });
//   }
//   next();
// };
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    // ✅ SAFE DEBUG LOG (HERE IS THE ONLY VALID PLACE)
    console.log("DECODED JWT USER:", {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      isAdmin: req.user.role === "admin",
    });

    next();
  } catch (err) {
    console.error("verifyUser error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const verifyAdmin = (req, res, next) => {
  console.log("VERIFY ADMIN USER:", req.user);

  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "This route is accessible only by admins" });
  }

  next();
};


