/**
 * Development Environment Configuration
 * This file contains all development-specific settings
 */

module.exports = {
  // Server Configuration
  port: process.env.PORT || 3000,
  
  // Environment
  environment: 'development',
  nodeEnv: 'development',
  
  // Database Configuration
  database: {
    mongoConnectUri: process.env.MONGODB_URI || process.env.mongodbUri || 'mongodb://localhost:27017/pickaar_users_dev',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Development-specific options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    timeout: 30000, // 30 seconds
  },
  
  // Logging Configuration
  logging: {
    level: 'debug',
    format: 'dev',
    enableConsole: true,
    enableFile: false,
  },
  
  // CORS Configuration
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4200', 'http://127.0.0.1:3000'],
    credentials: true,
  },
  
  // Swagger Configuration
  swagger: {
    enabled: true,
    path: '/api-docs',
  },
  
  // Security Configuration
  security: {
    // Development: Less strict security
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Allow more requests in development
    },
  },
  
  // Error Handling
  errorHandling: {
    showStack: true,
    showDetails: true,
  },
};

