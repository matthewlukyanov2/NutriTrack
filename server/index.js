require("dotenv").config({
  path: process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env"
});

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// DO NOT connect or listen during tests
if (process.env.NODE_ENV !== "test") {
  connectDB();

  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}
