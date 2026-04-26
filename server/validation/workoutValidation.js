const Joi = require('joi');

// Validation schema for workout entries
// Ensures workout name and duration are provided and valid
exports.workoutSchema = Joi.object({
  name: Joi.string().min(2).required(),
  duration: Joi.number().min(1).required(),
  caloriesBurned: Joi.number().optional()
});
