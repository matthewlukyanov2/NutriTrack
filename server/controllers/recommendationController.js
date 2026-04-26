const Meal = require('../models/Meal');
const recommendationService = require('../services/recommendationService');  

// @desc    Get meal recommendations (future TF-IDF)
// @route   GET /api/recommendations/meals
// @access  Private
exports.getMealRecommendations = async (req, res) => {
  try {
    // Fetch all meals belonging to the authenticated user
    const meals = await Meal.find({ user: req.user.id });

    console.log("Meals found:", meals);

    // If no meals exists return empty recommendations
    if (!meals || meals.length === 0) {
      return res.status(200).json([]); 
    }

    // Generate recommendations using TF-IDF service
    const recommendations = recommendationService.getRecommendations(meals);

    console.log("Recommendations:", recommendations);

    // Ensure returned data is valid
    if (!Array.isArray(recommendations)) {
      throw new Error("RecommendationService did not return an array");
    }

    // Return recommendations as JSON response
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
};
