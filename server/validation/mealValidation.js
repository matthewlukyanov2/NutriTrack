const Joi = require('joi');

exports.mealSchema = Joi.object({
  name: Joi.string().min(2).required(),
  calories: Joi.number().min(0).required(),
  protein: Joi.number().min(0).required(),
  carbs: Joi.number().min(0).required(),
  fats: Joi.number().min(0).required(),
});
