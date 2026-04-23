const express = require("express");
const router = express.Router();
const Meal = require("../models/Meal");
const authMiddleware = require("../middleware/authMiddleware");
const { getLLMMealRecommendations,
  getWeeklyMealPlan } = require("../services/openaiService");

  console.log("✅ LLM routes loaded");

  /**
 * @swagger
 * /api/recommendations/meals:
 *   get:
 *     summary: Get AI-generated meal recommendations
 *     description: Returns personalised meal recommendations based on the authenticated user's recently logged meals
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommendations generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       meal:
 *                         type: string
 *                         example: Grilled Chicken with Broccoli
 *                       reason:
 *                         type: string
 *                         example: High in protein and suitable for muscle recovery
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to generate recommendations
 */

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

/**
 * @swagger
 * /api/recommendations/meal-plan:
 *   get:
 *     summary: Generate AI-based weekly meal plan
 *     description: Returns a seven-day AI-generated meal plan based on the authenticated user's meal history
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly meal plan generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plan:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: string
 *                         example: Monday
 *                       breakfast:
 *                         type: string
 *                         example: Oatmeal with banana and almonds
 *                       lunch:
 *                         type: string
 *                         example: Grilled chicken salad with mixed greens
 *                       dinner:
 *                         type: string
 *                         example: Baked salmon with steamed broccoli
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to generate meal plan
 */

router.get("/meal-plan", authMiddleware, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(10);

    const result = await getWeeklyMealPlan(meals);

    res.json(result);
  } catch (err) {
    console.error("Meal Plan error:", err.message);
    res.status(500).json({ message: "Failed to generate meal plan" });
  }
});

module.exports = router;