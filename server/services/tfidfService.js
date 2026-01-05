const natural = require('natural');
const TfIdf = natural.TfIdf;

class TfidfService {
    recommendMeals(meals, limit = 3) {
    if (!meals || meals.length === 0) return [];

    const tfidf = new TfIdf();

    // 1. Add meals as documents
    meals.forEach(meal => {
      const doc = `
        ${meal.name}
        protein ${meal.protein}
        carbs ${meal.carbs}
        fats ${meal.fats}
      `;
      tfidf.addDocument(doc);
    });

    // 2. Score meals
    const scoredMeals = meals.map((meal, index) => {
        let score = 0;
  
        tfidf.tfidfs(meal.name, (i, measure) => {
          if (i === index) score = measure;
        });
  
        return {
          meal,
          score
        };
      });
 
}
      

  }
  
  module.exports = new TfidfService();
  