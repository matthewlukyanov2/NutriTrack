const Meal = require('../models/Meal');
const recommendationService = require('../services/recommendationService');  

// @desc    Get meal recommendations (future TF-IDF)
// @route   GET /api/recommendations/meals
// @access  Private
exports.getMealRecommendations = async (req, res) => {
  try {
    // Fetch meals associated with the logged-in user
    const meals = await Meal.find({ user: req.user.id });

    console.log("Meals found:", meals);

    if (!meals || meals.length === 0) {
      return res.status(200).json([]); // Return empty array if no meals are found
    }

    const recommendations = recommendationService.getRecommendations(meals);

    console.log("Recommendations:", recommendations);

    if (!Array.isArray(recommendations)) {
      throw new Error("RecommendationService did not return an array");
    }

    // Return the recommended meals as JSON
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
};
