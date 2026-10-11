
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/
    },
    password: {
      type: String,
      required: true
    },
    address: {
      type: String,
      default: "",
      trim: true
    },
    city: {
      type: String,
      default: "",
      trim: true
    },
    state: {
      type: String,
      default: "",
      trim: true
    },
    postalCode: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
