// Express application configuration
// Sets up middleware, routes, and global error handling
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middleware/errorMiddleware");
const recommendationRoutes = require("./routes/recommendationRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Routes imports
const authRoutes = require("./routes/authRoutes");
const mealRoutes = require("./routes/mealRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const aiRoutes = require("./routes/aiRoutes");
const llmRoutes = require("./routes/llmRecommendations");

const app = express();

// Rate limiting to prevent abuse (max 100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests, please try again later."
});

// Middleware configuration
app.use(express.json());
// Enable CORS for frontend applications (local + deployed)
app.use(cors(
  {
  origin: ["http://localhost:3000", "https://nutri-track-ke7v.vercel.app"],
  credentials: true
}
));
// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());
// Apply rate limiting to all requests
app.use(limiter);

// Default route (API health check)
app.get("/", (req, res) => {
  res.send("NutriTrack API is running...");
});

// API route definitions
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Swagger documentation endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// AI-related routes
app.use("/api/ai", aiRoutes);
app.use("/api/llm", llmRoutes);

// Error handler (last)
app.use(errorHandler);

module.exports = app;
