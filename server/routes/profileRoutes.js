
const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    return res.status(500).json({
      message: "Unable to load profile."
    });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, address, city, state, postalCode } =
      req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        message: "Full name is required."
      });
    }

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits."
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        fullName: fullName.trim(),
        phone,
        address: address || "",
        city: city || "",
        state: state || "",
        postalCode: postalCode || ""
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    return res.status(500).json({
      message: "Unable to update profile."
    });
  }
});

module.exports = router;
