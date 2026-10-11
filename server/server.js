
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require("node:dns").setServers(["1.1.1.1", "8.8.8.8"]);

const adoptionRoutes = require("./routes/adoptionRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Pawfect Home backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/adoptions", adoptionRoutes);

app.get("/api/profile", (req, res, next) => {
  req.url = "/";
  profileRoutes(req, res, next);
});

app.put("/api/profile", (req, res, next) => {
  req.url = "/";
  profileRoutes(req, res, next);
});

app.use("/api/profile", profileRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Pawfect Home server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
