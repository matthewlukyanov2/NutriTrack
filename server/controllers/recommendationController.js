const Meal = require('../models/Meal');
const tfidfService = require('../services/tfidfService');

// @desc    Get meal recommendations (future TF-IDF)
// @route   GET /api/recommendations/meals
// @access  Private
exports.getMealRecommendations = async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id });

    console.log("Meals found:", meals);

    if (!meals || meals.length === 0) {
      return res.status(200).json([]);
    }

    const recommendations = tfidfService.recommendMeals(meals);

    console.log("Recommendations:", recommendations);

    if (!Array.isArray(recommendations)) {
      throw new Error("TF-IDF did not return an array");
    }

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
};
