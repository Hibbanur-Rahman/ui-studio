import  swaggerJsdoc from 'swagger-jsdoc';
import  dotenv from 'dotenv';
import path from 'path';
dotenv.config();
const PORT=process.env.PORT;

// Determine if running in development (TypeScript) or production (compiled JavaScript)
const isDevelopment = __filename.endsWith('.ts');
const rootDir = isDevelopment ? './src' : path.join(__dirname, '..');

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'VERTEV Backend API',
        version: '1.0.0',
        description: 'API documentation for VERTEV (Ev rental) Backend',
        contact: {
          name: 'API Support',
          email: 'support@VERTEV.com'
        }
      },
      servers: [
        {
          url: `http://localhost:${PORT || 5000}/api`,
          description: 'Development server'
        },
        {
          url: 'https://api.vertev.in/api',
          description: 'Production server'
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
      }
    },
    apis: [
      `${rootDir}/api-docs/*.${isDevelopment ? 'ts' : 'js'}`,
      `${rootDir}/api-docs/docs/*.${isDevelopment ? 'ts' : 'js'}`,
      `${rootDir}/routes/**/*.${isDevelopment ? 'ts' : 'js'}`,
      `${rootDir}/controller/**/*.${isDevelopment ? 'ts' : 'js'}`
    ] // Path to the API docs
  };
  
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  export default swaggerSpec;