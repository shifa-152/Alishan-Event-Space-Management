// backend/app.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./db"); // your DB connect util
const cors = require("cors");

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
app.use(cors({ origin: "http://localhost:3000", methods: ["GET","POST","PUT","DELETE"], allowedHeaders: ["Content-Type","Authorization"] }));
app.use(express.json());

app.use("/api/booking", bookingRoutes);

// health
app.get("/", (req, res) => res.send("API ok"));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}).catch(err => {
  console.error("DB connect failed", err);
});
