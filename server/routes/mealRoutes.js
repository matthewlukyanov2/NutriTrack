const express = require("express");
const router = express.Router();

const {
  addMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal
} = require('../controllers/mealController');

const protect = require('../middleware/authMiddleware');

router.post('/', protect, addMeal);
router.get('/', protect, getMeals);
router.get('/:id', protect, getMealById);
router.put('/:id', protect, updateMeal);
router.delete('/:id', protect, deleteMeal);

module.exports = router;
