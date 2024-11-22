import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Quiz API Documentation',
    version: '1.0.0',
    description: 'This is the API documentation for the Quiz Application',
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development Server',
    },
  ],
};

// Options for Swagger
const swaggerOptions = {
  swaggerDefinition,
  apis: [ './src/docs/*.swagger.ts', './src/dto/*.ts'], // Adjust paths as needed
};

// Initialize SwaggerJSDoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Function to set up Swagger
export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger Docs available at http://localhost:5000/api-docs');
};
