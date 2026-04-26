const mongoose = require("mongoose");

// Connect to MongoDB using Mongoose
// Skips connection when running in test environment
const connectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  try {
    // Establish connection using environment variable URI
    // Options used to avoid deprecated MongoDB driver warnings
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
    });

    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    // Exit process if database connection fails
    process.exit(1); 
  }
};

module.exports = connectDB;
