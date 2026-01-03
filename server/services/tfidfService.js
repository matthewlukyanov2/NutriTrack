/**
 * TF-IDF Recommendation Service 
 * Future responsibility:
 *  - Build corpus from meals/workouts
 *  - Calculate TF-IDF vectors
 *  - Return ranked recommendations
 */

class TfidfService {
    buildCorpus(meals) {
      //tokenize meal names / ingredients
      return [];
    }
  
    calculateTfIdf(corpus) {
      //compute TF-IDF matrix
      return [];
    }
  
    recommend(userMeals, allMeals) {
      //compare vectors and rank meals
      return [];
    }
  }
  
  module.exports = new TfidfService();
  