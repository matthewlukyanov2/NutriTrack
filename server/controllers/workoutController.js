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

  // @desc    Get all workouts for user
  // @route   GET /api/workouts
  // @access  Private
  
exports.getWorkouts = async (req, res) => {
    try {
      const workouts = await Workout.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json(workouts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching workouts' });
    }
  };
  

