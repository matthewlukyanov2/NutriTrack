const Meal = require('../models/Meal');

// Add a meal
exports.addMeal = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fats } = req.body;

    const meal = await Meal.create({
      user: req.user.id,
      name,
      calories,
      protein,
      carbs,
      fats,
    });

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
