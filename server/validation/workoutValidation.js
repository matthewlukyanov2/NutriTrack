const Joi = require('joi');

exports.workoutSchema = Joi.object({
  type: Joi.string().min(2).required(),
  duration: Joi.number().min(1).required(),
  caloriesBurned: Joi.number().min(0).required(),
});
