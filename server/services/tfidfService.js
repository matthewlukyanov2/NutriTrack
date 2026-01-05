const natural = require('natural');
const TfIdf = natural.TfIdf;

class TfidfService {
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

  }
  
  module.exports = new TfidfService();
  