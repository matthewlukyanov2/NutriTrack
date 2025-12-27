const Workout = require('../models/Workout');
const { workoutSchema } = require('../validation/workoutValidation');

// @desc    Add a workout
// @route   POST /api/workouts
// @access  Private
exports.addWorkout = async (req, res) => {
  try {
    const { error } = workoutSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

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

  // @desc    Get a single workout
// @route   GET /api/workouts/:id
// @access  Private
exports.getWorkoutById = async (req, res) => {
  try {
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
    const { error } = workoutSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) return res.status(404).json({ message: 'Workout not found' });

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

  

