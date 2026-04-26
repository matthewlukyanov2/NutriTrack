// Entry point of the application
// Loads environment variables, connects to database, and starts server
require("dotenv").config({
  path: process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env"
});

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Prevent server start and DB connection during automated testing
if (process.env.NODE_ENV !== "test") {
  // Connect to MongoDB database
  connectDB();

  // Start Express server
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}
