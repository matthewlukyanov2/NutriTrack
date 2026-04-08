const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  caloriesBurned: {
    type: Number,
    default: 0,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);