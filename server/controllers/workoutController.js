const Workout = require('../models/Workout');

// @desc    Add a workout
// @route   POST /api/workouts
// @access  Private
exports.addWorkout = async (req, res) => {
  try {
    const { type, duration, caloriesBurned } = req.body;

    const workout = await Workout.create({
      user: req.user.id,
      type,
      duration,
      caloriesBurned,
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
