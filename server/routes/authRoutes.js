
const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const EmailOTP = require("../models/EmailOTP");
const PasswordReset = require("../models/PasswordReset");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

const generateOTP = () =>
  crypto.randomInt(100000, 1000000).toString();

const hashOTP = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

const validPassword = (password) =>
  typeof password === "string" &&
  password.length >= 8 &&
  /[A-Za-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

const sendOTPEmail = async (email, fullName, otp, isReset = false) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("Brevo API key is not configured.");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "Pawfect Home",
        email: "pawfecthome247@gmail.com",
      },
      to: [{ email, name: fullName }],
      subject: isReset
        ? "Reset your Pawfect Home password"
        : "Verify your Pawfect Home email",
      textContent: isReset
        ? `Hello ${fullName}, your password reset code is ${otp}. It expires in 5 minutes. If you did not request this, ignore this email.`
        : `Hello ${fullName}, your Pawfect Home verification code is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
      htmlContent: isReset
        ? `<p>Hello ${fullName},</p><p>Your password reset code is:</p><h2>${otp}</h2><p>This code expires in 5 minutes. If you did not request this, ignore this email.</p>`
        : `<p>Hello ${fullName},</p><p>Your Pawfect Home verification code is:</p><h2>${otp}</h2><p>This code expires in 5 minutes. Do not share it with anyone.</p>`,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Brevo email error:", response.status, details);
    throw new Error("Unable to send verification email.");
  }
};

// REGISTER
router.post("/register", otpLimiter, async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName?.trim() || !email?.trim() || !phone || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits.",
      });
    }

    if (!validPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include a letter, a number, and a special character.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({
        message: "An account with this email already exists. Please log in.",
      });
    }

    const otp = generateOTP();
    const now = new Date();

    await EmailOTP.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          fullName: fullName.trim(),
          phone,
          passwordHash: await bcrypt.hash(password, 10),
          otpHash: hashOTP(otp),
          expiresAt: new Date(now.getTime() + 5 * 60 * 1000),
          resendAfter: new Date(now.getTime() + 60 * 1000),
          attempts: 0,
        },
        $setOnInsert: { email: normalizedEmail },
      },
      { upsert: true, new: true, runValidators: true }
    );

    try {
      await sendOTPEmail(normalizedEmail, fullName.trim(), otp);
    } catch (emailError) {
      await EmailOTP.deleteOne({ email: normalizedEmail });
      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email. It expires in 5 minutes.",
    });
  } catch (error) {
    console.error("Registration OTP error:", error.message);
    return res.status(500).json({
      message: "Could not send the verification code. Please try again.",
    });
  }
});

// VERIFY REGISTRATION OTP
router.post("/verify-otp", otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (
      typeof email !== "string" ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        message: "Enter the valid 6-digit verification code.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const pending = await EmailOTP.findOne({ email: normalizedEmail });

    if (!pending) {
      return res.status(400).json({
        message: "No pending verification found. Please register again.",
      });
    }

    if (pending.expiresAt <= new Date()) {
      await EmailOTP.deleteOne({ _id: pending._id });
      return res.status(400).json({
        message: "Verification code expired. Please register again.",
      });
    }

    if (pending.attempts >= 5) {
      await EmailOTP.deleteOne({ _id: pending._id });
      return res.status(429).json({
        message: "Too many incorrect attempts. Please register again.",
      });
    }

    if (hashOTP(otp) !== pending.otpHash) {
      pending.attempts += 1;
      await pending.save();
      return res.status(400).json({
        message: "Incorrect verification code.",
      });
    }

    if (await User.findOne({ email: normalizedEmail })) {
      await EmailOTP.deleteOne({ _id: pending._id });
      return res.status(409).json({
        message: "An account with this email already exists. Please log in.",
      });
    }

    await User.create({
      fullName: pending.fullName,
      email: pending.email,
      phone: pending.phone,
      password: pending.passwordHash,
    });

    await EmailOTP.deleteOne({ _id: pending._id });

    return res.status(201).json({
      success: true,
      message: "Email verified and account created successfully. Please log in.",
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);
    return res.status(500).json({
      message: "Verification failed. Please try again.",
    });
  }
});

// RESEND REGISTRATION OTP
router.post("/resend-otp", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Please provide your email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const pending = await EmailOTP.findOne({ email: normalizedEmail });

    if (!pending) {
      return res.status(404).json({
        message: "No pending registration found. Please register again.",
      });
    }

    const now = new Date();

    if (pending.resendAfter > now) {
      const seconds = Math.ceil(
        (pending.resendAfter.getTime() - now.getTime()) / 1000
      );
      return res.status(429).json({
        message: `Please wait ${seconds} seconds before requesting another code.`,
      });
    }

    const otp = generateOTP();

    pending.otpHash = hashOTP(otp);
    pending.expiresAt = new Date(now.getTime() + 5 * 60 * 1000);
    pending.resendAfter = new Date(now.getTime() + 60 * 1000);
    pending.attempts = 0;
    await pending.save();

    try {
      await sendOTPEmail(pending.email, pending.fullName, otp);
    } catch (emailError) {
      await EmailOTP.deleteOne({ _id: pending._id });
      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    console.error("OTP resend error:", error.message);
    return res.status(500).json({
      message: "Could not resend the verification code. Please try again.",
    });
  }
});

// FORGOT PASSWORD: Send reset OTP
router.post("/forgot-password", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Please enter your registered email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account exists for this email, a reset code will be sent.",
      });
    }

    const now = new Date();
    const existingReset = await PasswordReset.findOne({
      email: normalizedEmail,
    });

    if (existingReset && existingReset.resendAfter > now) {
      const seconds = Math.ceil(
        (existingReset.resendAfter.getTime() - now.getTime()) / 1000
      );
      return res.status(429).json({
        message: `Please wait ${seconds} seconds before requesting another code.`,
      });
    }

    const otp = generateOTP();

    await PasswordReset.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          otpHash: hashOTP(otp),
          expiresAt: new Date(now.getTime() + 5 * 60 * 1000),
          resendAfter: new Date(now.getTime() + 60 * 1000),
          attempts: 0,
          verifiedUntil: null,
        },
        $setOnInsert: { email: normalizedEmail },
      },
      { upsert: true, new: true, runValidators: true }
    );

    try {
      await sendOTPEmail(
        normalizedEmail,
        user.fullName,
        otp,
        true
      );
    } catch (emailError) {
      await PasswordReset.deleteOne({ email: normalizedEmail });
      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: "If an account exists for this email, a reset code will be sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({
      message: "Could not process the request. Please try again.",
    });
  }
});

// VERIFY PASSWORD RESET OTP
router.post("/verify-reset-otp", otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (
      typeof email !== "string" ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        message: "Enter the valid 6-digit reset code.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const reset = await PasswordReset.findOne({
      email: normalizedEmail,
    });

    if (!reset || reset.expiresAt <= new Date()) {
      if (reset) {
        await PasswordReset.deleteOne({ _id: reset._id });
      }
      return res.status(400).json({
        message: "Reset code expired or unavailable. Request a new code.",
      });
    }

    if (reset.attempts >= 5) {
      await PasswordReset.deleteOne({ _id: reset._id });
      return res.status(429).json({
        message: "Too many incorrect attempts. Request a new code.",
      });
    }

    if (hashOTP(otp) !== reset.otpHash) {
      reset.attempts += 1;
      await reset.save();
      return res.status(400).json({
        message: "Incorrect reset code.",
      });
    }

    reset.verifiedUntil = new Date(Date.now() + 10 * 60 * 1000);
    await reset.save();

    return res.status(200).json({
      success: true,
      message: "Code verified. You can now reset your password.",
    });
  } catch (error) {
    console.error("Reset OTP verification error:", error.message);
    return res.status(500).json({
      message: "Could not verify the reset code. Please try again.",
    });
  }
});

// RESET PASSWORD
router.post("/reset-password", otpLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      !validPassword(password)
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include a letter, a number, and a special character.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const reset = await PasswordReset.findOne({
      email: normalizedEmail,
    });

    if (
      !reset ||
      !reset.verifiedUntil ||
      reset.verifiedUntil <= new Date() ||
      reset.expiresAt <= new Date()
    ) {
      return res.status(403).json({
        message: "Please verify a valid reset code before changing your password.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      await PasswordReset.deleteOne({ _id: reset._id });
      return res.status(400).json({
        message: "Unable to reset this account. Please request a new code.",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await PasswordReset.deleteOne({ _id: reset._id });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please log in with your new password.",
    });
  } catch (error) {
    console.error("Password reset error:", error.message);
    return res.status(500).json({
      message: "Could not reset the password. Please try again.",
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
