require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Make sure MongoDB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use(
  "/api/auth",
  require("./routes/auth")
);

app.use(
  "/api/images",
  require("./routes/images")
);

// Health check
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "FoodBite API",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ API Error:", err);

  res.status(
    err.status || 500
  ).json({
    message: err.message || "Server error",
  });
});

module.exports = app;