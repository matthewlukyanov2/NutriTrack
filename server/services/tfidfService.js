const natural = require('natural');
const TfIdf = natural.TfIdf;

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
  