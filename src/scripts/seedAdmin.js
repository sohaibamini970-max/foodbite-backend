require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

(async () => {
  await connectDB();
  const exists = await User.findOne({ email: "admin@foodbite.com" });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }
  await User.create({
    name: "Admin User",
    email: "admin@foodbite.com",
    phone: "+92 300 7654321",
    password: "admin123",
    country: "Pakistan",
    city: "Karachi",
    area: "DHA Phase 5",
    role: "admin",
  });
  console.log("✅ Admin created: admin@foodbite.com / admin123");
  process.exit(0);
})();