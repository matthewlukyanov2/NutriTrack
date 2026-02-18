const natural = require('natural');
const TfIdf = natural.TfIdf;

class RecommendationService {
  async getRecommendations(userMeals, limit = 3) {
    if (!userMeals || userMeals.length === 0) return [];

    const tfidf = new TfIdf();

    // 1. Add meals as documents
    userMeals.forEach(meal => {
      const doc = `
        ${meal.name}
        protein ${meal.protein}
        carbs ${meal.carbs}
        fats ${meal.fats}
      `;
      tfidf.addDocument(doc);
    });

    // 2. Score meals
    const scoredMeals = userMeals.map((meal, index) => {
      let score = 0;
  
      tfidf.tfidfs(meal.name, (i, measure) => {
        if (i === index) score = measure;
      });
  
      return {
        meal,
        score
      };
    });
    
    // 3. Sort & return top meals
    return scoredMeals
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.meal);
  }
}

module.exports = new RecommendationService();
