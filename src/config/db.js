const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;

    console.log("✅ MongoDB connected");

    return mongoose.connection;
  } catch (err) {
    isConnected = false;

    console.error("❌ MongoDB error:", err.message);

    throw err;
  }
}

module.exports = connectDB;