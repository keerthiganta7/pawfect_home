
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();
console.log("Auth routes loaded successfully");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists. Please log in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully. Please log in.",
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter your email and password.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found. Please register first.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
      });
    }

    const token = jwt.sign(
  { userId: user._id.toString() },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

return res.status(200).json({
  success: true,
  message: "Login successful.",
  token,
  user: {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
  },
});
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});

module.exports = router;
