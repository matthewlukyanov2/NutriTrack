const OpenAI = require("openai");

// Initialize OpenAI client using API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generates AI-based meal recommendations using OpenAI
// Takes user meals and an optional goal, then sends a prompt to the LLM
async function getLLMMealRecommendations(meals, goal) {
  const mealSummary = meals.map(m =>
    `${m.name} (${m.calories} kcal, P:${m.protein}g C:${m.carbs}g F:${m.fats}g)`
  ).join("\n");

  // Prompt instructs AI on task and forces structured JSON output
  const prompt = `
You are a nutrition assistant.

User goal: ${goal || "general healthy eating"}.

Here are meals the user has logged recently:
${mealSummary}

Task:
1. Suggest 3 new meal ideas different from what the user already logged.
2. Give each meal a short explanation.
3. Return output ONLY as valid JSON in this format:

{
  "recommendations": [
    { "name": "...", "reason": "..." },
    { "name": "...", "reason": "..." },
    { "name": "...", "reason": "..." }
  ]
}
`;

  // Send request to OpenAI model with the constructed prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const text = response.choices[0].message.content;

  // Parse AI response into JSON format
  return JSON.parse(text);
}

// Generates a full weekly meal plan using AI
// Returns structured data for 7 days with 3 meals each
async function getWeeklyMealPlan(meals) {
  // Simplified summary of meals for context in the prompt
  const mealSummary = meals.map(m =>
    `${m.name} (${m.calories} kcal)`
  ).join("\n");

  const prompt = `
You are a fitness meal planner.

User recent meals:
${mealSummary}

Task:
Generate a 7-day meal plan (Monday → Sunday).

Rules:
- 3 meals per day (breakfast, lunch, dinner)
- Keep meals simple and realistic
- Focus on healthy fitness-friendly meals

Return ONLY JSON:

{
  "days": [
    {
      "day": "Monday",
      "meals": ["...", "...", "..."]
    }
  ]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const text = response.choices[0].message.content;

// Clean response in case AI wraps JSON in markdown formatting
const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleaned);
}

module.exports = { getLLMMealRecommendations, getWeeklyMealPlan };