// Generic Joi validation middleware
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: true });
  
    if (error) {
      res.status(400);
      return next(new Error(error.details[0].message));
    }
  
    next();
  };
  
  module.exports = validate;
  