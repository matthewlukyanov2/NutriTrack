// Import JSON Web Token library for verifying tokens
const jwt = require('jsonwebtoken');
// Import the User model to fetch user data from the database
const User = require('../models/User');

// Middleware function to protect routes and ensure the user is authenticated
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by ID from the token payload
    // Exclude the password field from the result
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = protect;
