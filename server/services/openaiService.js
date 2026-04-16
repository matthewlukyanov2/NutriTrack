const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getLLMMealRecommendations(meals, goal) {
  const mealSummary = meals.map(m =>
    `${m.name} (${m.calories} kcal, P:${m.protein}g C:${m.carbs}g F:${m.fats}g)`
  ).join("\n");

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

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const text = response.choices[0].message.content;
  console.log("OPENAI SERVICE FILE LOADED");

  return JSON.parse(text);
}

module.exports = { getLLMMealRecommendations };