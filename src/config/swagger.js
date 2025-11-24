const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./configs');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pickaar Users API',
      version: '1.0.0',
      description: 'API documentation for Pickaar Users Service - handles both customer and vendor user management',
      contact: {
        name: 'API Support',
        email: 'support@pickaar.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
      {
        url: 'https://api.pickaar.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'number',
              description: 'HTTP status code',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            status: {
              type: 'number',
              description: 'HTTP status code',
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: [
    './src/api/routes/**/*.js',
    './src/api/controllers/**/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Setup Swagger UI
 * @param {Express} app - Express application instance
 */
const setupSwagger = (app) => {
  // Check if Swagger is enabled in config
  if (config.swagger && config.swagger.enabled) {
    app.use(config.swagger.path || '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Pickaar Users API Documentation',
    }));

    // JSON endpoint for Swagger spec
    app.get(`${config.swagger.path || '/api-docs'}.json`, (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  } else {
    console.log('Swagger documentation is disabled for this environment');
  }
};

module.exports = setupSwagger;

