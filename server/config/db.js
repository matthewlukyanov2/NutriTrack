const mongoose = require("mongoose");

const connectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;
