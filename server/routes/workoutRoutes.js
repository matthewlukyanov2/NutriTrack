const express = require("express");
const router = express.Router();
const validate = require('../middleware/validateMiddleware');
const { workoutSchema } = require('../validation/workoutValidation');

// Import workout controller functions
const {
  addWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
} = require('../controllers/workoutController');

const protect = require('../middleware/authMiddleware');

// Protected routes

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Get all workouts for authenticated user
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workouts
 */
router.get('/', protect, getWorkouts);

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Add a new workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workout'
 *     responses:
 *       201:
 *         description: Workout created
 */
router.post('/', protect, validate(workoutSchema), addWorkout);
router.get('/:id', protect, getWorkoutById);

/**
 * @swagger
 * /api/workouts/{id}:
 *   put:
 *     summary: Update a workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workout'
 *     responses:
 *       200:
 *         description: Workout updated
 */
router.put('/:id', validate(workoutSchema), protect, updateWorkout);

/**
 * @swagger
 * /api/workouts/{id}:
 *   delete:
 *     summary: Delete a workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout deleted
 */
router.delete('/:id', protect, deleteWorkout);

module.exports = router;
