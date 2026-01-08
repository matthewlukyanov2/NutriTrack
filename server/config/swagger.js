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
            name: {
              type: 'string',
              example: 'Chicken & Rice',
            },
            calories: {
              type: 'number',
              example: 550,
            },
            protein: {
              type: 'number',
              example: 45,
            },
            carbs: {
              type: 'number',
              example: 60,
            },
            fats: {
              type: 'number',
              example: 12,
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
