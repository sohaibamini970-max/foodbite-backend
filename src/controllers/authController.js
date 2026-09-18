const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, country, city, area } = req.body;

    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const imageUri = req.file
      ? `${process.env.BASE_URL}/uploads/${req.file.filename}`
      : "";

    const user = await User.create({
      name, email, phone, password, country, city, area, imageUri, role: "user",
    });

    res.status(201).json({
      message: "Registered successfully",
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    if (role && user.role !== role)
      return res.status(403).json({ message: `This account is not a ${role} account` });

    res.json({
      message: "Login successful",
      token: signToken(user._id),
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
};