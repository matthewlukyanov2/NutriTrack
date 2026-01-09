const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NutriTrack API',
      version: '1.0.0',
      description: 'Backend API for NutriTrack fitness and nutrition app',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Meal: {
          type: 'object',
          required: ['name', 'calories', 'protein', 'carbs', 'fats'],
          properties: {
            name: { type: 'string', example: 'Chicken & Rice' },
      calories: { type: 'number', example: 550 },
      protein: { type: 'number', example: 45 },
      carbs: { type: 'number', example: 60 },
      fats: { type: 'number', example: 12 },
    },
  },

  Workout: {
    type: 'object',
    required: ['type', 'duration', 'caloriesBurned'],
    properties: {
      type: { type: 'string', example: 'Running' },
      duration: { type: 'number', example: 45 },
      caloriesBurned: { type: 'number', example: 300 },
    },
  },

  UserRegister: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', example: 'Test User' },
      email: { type: 'string', example: 'test@example.com' },
      password: { type: 'string', example: '123456' },
    },
  },

  UserLogin: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', example: 'test@example.com' },
      password: { type: 'string', example: '123456' },
    },
  },

  AuthResponse: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
      token: { type: 'string' },
    },
  },
},
            
      },
    },
 
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
