// Middleware to handle errors and send appropriate responses to the client
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // If the response status code is still 200, set it to 500 for server errors
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    res.status(statusCode).json({
      message: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = errorHandler;
  
  