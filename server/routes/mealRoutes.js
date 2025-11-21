const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal
} = require('../controllers/mealController');

router.post('/', protect, addMeal);
router.get('/', protect, getMeals);
router.get('/:id', protect, getMealById);
router.put('/:id', protect, updateMeal);
router.delete('/:id', protect, deleteMeal);

module.exports = router;
