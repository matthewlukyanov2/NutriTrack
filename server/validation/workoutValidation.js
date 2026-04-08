const Joi = require('joi');

exports.workoutSchema = Joi.object({
  name: Joi.string().min(2).required(),
  duration: Joi.number().min(1).required(),
  caloriesBurned: Joi.number().optional()
});
