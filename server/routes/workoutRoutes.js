const express = require("express");
const router = express.Router();

const {
  addWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
} = require('../controllers/workoutController');

const protect = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, addWorkout);
router.get('/', protect, getWorkouts);
router.get('/:id', protect, getWorkoutById);
router.put('/:id', protect, updateWorkout);
router.delete('/:id', protect, deleteWorkout);

module.exports = router;
