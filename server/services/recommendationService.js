const natural = require('natural');
const TfIdf = natural.TfIdf;

class RecommendationService {
  // Generates meal recommendations using TF-IDF similarity
  // This acts as a non-AI fallback recommendation approach
  async getRecommendations(userMeals, limit = 3) {
    if (!userMeals || userMeals.length === 0) return [];

    const tfidf = new TfIdf();

    // Convert meals into text documents for analysis
    userMeals.forEach(meal => {
      const doc = `
        ${meal.name}
        protein ${meal.protein}
        carbs ${meal.carbs}
        fats ${meal.fats}
      `;
      tfidf.addDocument(doc);
    });

    // Calculate relevance scores for each meal
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
    
    // Return top meals based on highest relevance score
    return scoredMeals
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.meal);
  }
}

module.exports = new RecommendationService();
