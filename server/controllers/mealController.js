const Meal = require('../models/Meal');

// @desc    Add a meal
// @route   POST /api/meals
// @access  Private
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

// @desc    Get all meals for user
// @route   GET /api/meals
// @access  Private
exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meals' });
  }
};

// @desc    Get single meal by ID
// @route   GET /api/meals/:id
// @access  Private
exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, user: req.user.id });

    if (!meal) return res.status(404).json({ message: 'Meal not found' });

    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meal' });
  }
};

// @desc    Update a meal
// @route   PUT /api/meals/:id
// @access  Private
exports.updateMeal = async (req, res) => {
    try {
      const meal = await Meal.findOne({ _id: req.params.id, user: req.user.id });
  
      if (!meal) {
        return res.status(404).json({ message: 'Meal not found' });
      }
  
      const updatedMeal = await Meal.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
  
      res.status(200).json(updatedMeal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating meal' });
    }
  };
  