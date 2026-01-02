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

router.post('/', protect, validate(mealSchema), addMeal);
router.get('/', protect, getMeals);
router.get('/:id', protect, getMealById);
router.put('/:id', protect, validate(mealSchema), updateMeal);
router.delete('/:id', protect, deleteMeal);

module.exports = router;
