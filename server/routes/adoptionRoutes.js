
const express = require("express");
const AdoptionApplication = require("../models/AdoptionApplication");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const application = new AdoptionApplication({
      ...req.body,
      userId: req.userId
    });

    await application.save();

    return res.status(201).json({
      message: "Adoption application submitted successfully.",
      application
    });
  } catch (error) {
    console.error("Adoption submission error:", error.message);

    return res.status(500).json({
      message: "Unable to submit adoption application."
    });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({
      userId: req.userId
    }).sort({ submittedAt: -1 });

    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Adoption history error:", error.message);

    return res.status(500).json({
      message: "Unable to load adoption history."
    });
  }
});

module.exports = router;
