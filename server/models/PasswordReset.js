
const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    resendAfter: {
      type: Date,
      required: true,
    },
    verifiedUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PasswordReset", passwordResetSchema);
