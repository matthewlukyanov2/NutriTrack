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

    // Get meals after adding a new one
    exports.getMeals = async (req, res) => {
      try {
        const meals = await Meal.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(meals);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching meals' });
      }
    };

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
