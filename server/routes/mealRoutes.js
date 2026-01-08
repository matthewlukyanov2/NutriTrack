const express = require("express");
const router = express.Router();
const validate = require('../middleware/validateMiddleware');
const { mealSchema } = require('../validation/mealValidation');

const {
  addMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal
} = require('../controllers/mealController');

const protect = require('../middleware/authMiddleware');


/**
 * @swagger
 * /api/meals:
 *   get:
 *     summary: Get all meals for authenticated user
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of meals
 */
router.get('/', protect, getMeals);

/**
 * @swagger
 * /api/meals:
 *   post:
 *     summary: Add a new meal
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meal'
 *     responses:
 *       201:
 *         description: Meal created
 */
router.post('/', protect, validate(mealSchema), addMeal);
router.get('/:id', protect, getMealById);
router.put('/:id', protect, validate(mealSchema), updateMeal);
router.delete('/:id', protect, deleteMeal);

module.exports = router;
