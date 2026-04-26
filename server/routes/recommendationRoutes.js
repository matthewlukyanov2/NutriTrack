const express = require('express');
const router = express.Router();

const { getMealRecommendations } = require('../controllers/recommendationController');
const protect = require('../middleware/authMiddleware');

// Protected route to get meal recommendations based on user's meal history
router.get('/meals', protect, getMealRecommendations);

module.exports = router;