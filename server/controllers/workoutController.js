const Workout = require('../models/Workout');
const { workoutSchema } = require('../validation/workoutValidation');

// @desc    Add a workout for the authenticated user
// @route   POST /api/workouts
// @access  Private
exports.addWorkout = async (req, res) => {
  try {
    // Validate incoming request body using Joi schema
    const { error } = workoutSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, duration, caloriesBurned } = req.body;

    // Create workout and associate it with the logged-in user
    const workout = await Workout.create({
      user: req.user.id,
      name,
      duration,
      caloriesBurned: caloriesBurned || 0
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
      // Fetch workouts belonging only to the current user, sorted by newest first
      const workouts = await Workout.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json(workouts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching workouts' });
    }
  };

  // @desc    Get a single workout
// @route   GET /api/workouts/:id
// @access  Private
exports.getWorkoutById = async (req, res) => {
  try {
    // Ensure the workout belongs to the logged in user
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) return res.status(404).json({ message: 'Workout not found' });

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workout' });
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
exports.updateWorkout = async (req, res) => {
  try {
    // Validate updated data before applying changes
    const { error } = workoutSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    // Ensure user owns the workout before updating
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) return res.status(404).json({ message: 'Workout not found' });

    // Update workout and return the updated version
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Error updating workout' });
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
exports.deleteWorkout = async (req, res) => {
  try {
    // Ensure the workout belongs to the user before deletion
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) return res.status(404).json({ message: 'Workout not found' });

    await workout.deleteOne();

    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout' });
  }
};

  

