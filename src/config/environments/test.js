/**
 * Test Environment Configuration
 * This file contains all test-specific settings
 */

module.exports = {
  // Server Configuration
  port: process.env.PORT || 3001,
  
  // Environment
  environment: 'test',
  nodeEnv: 'test',
  
  // Database Configuration
  database: {
    mongoConnectUri: process.env.MONGODB_URI || process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/pickaar_users_test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Test-specific options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    },
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
    timeout: 10000,
  },
  
  // Logging Configuration
  logging: {
    level: 'error', // Only log errors in tests
    format: 'simple',
    enableConsole: false,
    enableFile: false,
  },
  
  // CORS Configuration
  cors: {
    origin: ['http://localhost:3001'],
    credentials: true,
  },
  
  // Swagger Configuration
  swagger: {
    enabled: false, // Disabled in test environment
    path: '/api-docs',
  },
  
  // Security Configuration
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 10000, // Allow many requests in tests
    },
  },
  
  // Error Handling
  errorHandling: {
    showStack: true,
    showDetails: true,
  },
};

