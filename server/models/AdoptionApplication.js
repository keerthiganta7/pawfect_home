const mongoose = require("mongoose");

const adoptionApplicationSchema = new mongoose.Schema(
  {
      userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
    petId: {
      type: Number,
      required: true,
    },

    petName: {
      type: String,
      required: true,
    },

    shelter: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    housing: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Pending",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AdoptionApplication",
  adoptionApplicationSchema
);