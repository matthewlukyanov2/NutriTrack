//Express app only for tests

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middleware/errorMiddleware");
const recommendationRoutes = require("./routes/recommendationRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Routes
const authRoutes = require("./routes/authRoutes");
const mealRoutes = require("./routes/mealRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const aiRoutes = require("./routes/aiRoutes");
const llmRoutes = require("./routes/llmRecommendations");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP
  message: "Too many requests, please try again later."
});

// Middleware
app.use(express.json());
app.use(cors(
  {
  origin: ["http://localhost:3000", "https://nutri-track-ke7v.vercel.app"],
  credentials: true
}
));
app.use(helmet());
app.use(limiter);

// Default route
app.get("/", (req, res) => {
  res.send("NutriTrack API is running...");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/ai", aiRoutes);
app.use("/api/llm", llmRoutes);

// Error handler (last)
app.use(errorHandler);

module.exports = app;
