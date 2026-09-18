require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => res.json({ ok: true, service: "FoodBite API" }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("FULL ERROR:", err);
    console.error("ERROR CODE:", err.code);
    console.error("ERROR REASON:", err.reason);
  });