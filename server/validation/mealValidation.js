const Joi = require('joi');

// Validation schema for meal creation and updates
// Ensures all nutritional values are valid and non-negative
exports.mealSchema = Joi.object({
  name: Joi.string().min(2).required(),
  calories: Joi.number().min(0).required(),
  protein: Joi.number().min(0).required(),
  carbs: Joi.number().min(0).required(),
  fats: Joi.number().min(0).required(),
  consumed: Joi.boolean().optional()
});
