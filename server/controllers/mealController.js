const Meal = require('../models/Meal');
const { mealSchema } = require('../validation/mealValidation');


// @desc    Add a meal
// @route   POST /api/meals
// @access  Private
exports.addMeal = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fats } = req.body;

    // Create meal and associate it with the logged-in user
    const meal = await Meal.create({
      user: req.user.id,
      name,
      calories,
      protein,
      carbs,
      fats,
      consumed: req.body.consumed || false
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
    // Fetch only meals belonging to the current user, newest first
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
    // Ensure users can only access their own meals
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
    // Find meal by ID and confirm it belongs to the authenticated user
    const meal = await Meal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Update only the fields included in the request body
    if (req.body.name !== undefined) meal.name = req.body.name;
    if (req.body.calories !== undefined) meal.calories = req.body.calories;
    if (req.body.protein !== undefined) meal.protein = req.body.protein;
    if (req.body.carbs !== undefined) meal.carbs = req.body.carbs;
    if (req.body.fats !== undefined) meal.fats = req.body.fats;
    if (req.body.consumed !== undefined) meal.consumed = req.body.consumed;

    const updatedMeal = await meal.save();

    res.status(200).json(updatedMeal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating meal' });
  }
};

// @desc    Delete a meal
// @route   DELETE /api/meals/:id
// @access  Private
exports.deleteMeal = async (req, res) => {
    try {
      // Ensure the meal exists and belongs to the current user before deletion
      const meal = await Meal.findOne({ _id: req.params.id, user: req.user.id });
  
      if (!meal) {
        return res.status(404).json({ message: 'Meal not found' });
      }
  
      await meal.deleteOne();
  
      res.status(200).json({ message: 'Meal deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting meal' });
    }
  };
  
  