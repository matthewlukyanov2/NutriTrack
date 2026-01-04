const express = require('express');
const router = express.Router();

const { getMealRecommendations } = require('../controllers/recommendationController');
const protect = require('../middleware/authMiddleware');

router.get('/meals', protect, getMealRecommendations);

module.exports = router;