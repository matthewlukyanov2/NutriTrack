// Generic Joi validation middleware
// Validates incoming request body against a given schema
// Used to enforce data integrity before reaching controllers
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: true });
  
    // If validation fails, return a 400 error with the first validation message
    if (error) {
      res.status(400);
      return next(new Error(error.details[0].message));
    }
  
    // Proceed to next middleware/controller if validation passes
    next();
  };
  
  module.exports = validate;
  