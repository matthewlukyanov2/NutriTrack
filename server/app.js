//Express app only for tests

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const errorHandler = require("./middleware/errorMiddleware");
const recommendationRoutes = require("./routes/recommendationRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Routes
const authRoutes = require("./routes/authRoutes");
const mealRoutes = require("./routes/mealRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors(
  {
  origin: ["http://localhost:3000", "https://my-vercel-url.vercel.app"],
  credentials: true
}
));
app.use(helmet());

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

// Error handler (last)
app.use(errorHandler);

module.exports = app;
