const express = require("express");
const router = express.Router();
const validate = require('../middleware/validateMiddleware');
const { workoutSchema } = require('../validation/workoutValidation');

const {
  addWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
} = require('../controllers/workoutController');

const protect = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, validate(workoutSchema), addWorkout);
router.get('/', protect, getWorkouts);
router.get('/:id', protect, getWorkoutById);
router.put('/:id', validate(workoutSchema), protect, updateWorkout);
router.delete('/:id', protect, deleteWorkout);

module.exports = router;
