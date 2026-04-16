const express = require("express");
const router = express.Router();
const Meal = require("../models/Meal");
const authMiddleware = require("../middleware/authMiddleware");
const { getLLMMealRecommendations } = require("../services/openaiService");

router.get("/meals", authMiddleware, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(10);

    if (!meals.length) {
      return res.json({ recommendations: [] });
    }

    const result = await getLLMMealRecommendations(
      meals,
      "fitness and healthy eating"
    );

    res.json(result);
  } catch (err) {
    console.error("🔥 FULL LLM ERROR:", err);
  res.status(500).json({
    message: err.message,
    error: err.stack
  });
}
});

module.exports = router;