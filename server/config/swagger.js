const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '',
    info: {
      title: '',
      version: '',
      description: ''
    },
    servers: [
      {
        url: ''
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: []
};

module.exports = swaggerJsdoc(options);
