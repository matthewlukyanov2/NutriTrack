require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;

// Import routes 
const authRoutes = require("./routes/authRoutes");
const mealRoutes = require("./routes/mealRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const aiRoutes = require("./routes/aiRoutes");


// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Connect to MongoDB
connectDB(); // calls the external db.js function

// Default route
app.get("/", (req, res) => {
  res.send("NutriTrack API is running...");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/ai", aiRoutes);

// Start server
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));