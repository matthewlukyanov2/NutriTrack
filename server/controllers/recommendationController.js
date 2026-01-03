const Meal = require('../models/Meal');
const tfidfService = require('../services/tfidfService');

// @desc    Get meal recommendations (future TF-IDF)
// @route   GET /api/recommendations/meals
// @access  Private
exports.getMealRecommendations = async (req, res) => {
  try {
    const userMeals = await Meal.find({ user: req.user.id });
    const allMeals = await Meal.find();

    const recommendations = tfidfService.recommend(userMeals, allMeals);

    res.status(200).json({
      message: 'Recommendation engine scaffolded',
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
};
