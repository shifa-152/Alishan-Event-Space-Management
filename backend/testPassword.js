import mongoose from "mongoose";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config(); // load .env variables

// Use same DB as backend
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));

async function testPassword() {
  try {
    const user = await User.findOne({ email: "javi@gmail.com" }); // your test email
    if (!user) return console.log("User not found");

    const passwordFromFrontend = "Javi@101"; // your test password
    const isMatch = await bcrypt.compare(passwordFromFrontend, user.password);
    console.log("Password match:", isMatch);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

testPassword();
