const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const getGridFSBucket = require("../utils/gridfs");

const signToken = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      country,
      city,
      area,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const exists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (exists) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    let imageId = null;

    // Upload image to MongoDB GridFS
    if (req.file) {
      const bucket = getGridFSBucket();

      const uploadStream = bucket.openUploadStream(
        req.file.originalname,
        {
          contentType: req.file.mimetype,

          metadata: {
            uploadedFor: "user-profile",
            originalName: req.file.originalname,
          },
        }
      );

      imageId = uploadStream.id;

      await new Promise((resolve, reject) => {
        uploadStream.on("finish", resolve);
        uploadStream.on("error", reject);

        uploadStream.end(req.file.buffer);
      });
    }

    const imageUri = imageId
      ? `/api/images/${imageId}`
      : "";

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      country,
      city,
      area,
      imageUri,
      role: "user",
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

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        message: `This account is not a ${role} account`,
      });
    }

    const token = signToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
};
