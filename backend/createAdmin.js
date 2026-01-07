import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js"; // adjust path

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const adminEmail = "admin@example.com";
  const adminPassword = "Admin123!";

  const hashed = await bcrypt.hash(adminPassword, 10);

  const admin = await User.findOneAndUpdate(
    { email: adminEmail },
    { password: hashed, role: "admin" },
    { upsert: true, new: true }
  );

  console.log("Admin created/updated:", admin);
  mongoose.connection.close();
});
