/**
 * Production Environment Configuration
 * This file contains all production-specific settings
 */

module.exports = {
  // Server Configuration
  port: process.env.PORT || 3000,
  
  // Environment
  environment: 'production',
  nodeEnv: 'production',
  
  // Database Configuration
  database: {
    mongoConnectUri: process.env.MONGODB_URI || process.env.mongodbUri,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Production-specific options
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      // Connection pool settings
      retryWrites: true,
      w: 'majority',
    },
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api.pickaar.com',
    timeout: 15000, // 15 seconds (shorter timeout in production)
  },
  
  // Logging Configuration
  logging: {
    level: 'info',
    format: 'combined',
    enableConsole: true,
    enableFile: true,
    filePath: './logs/app.log',
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://pickaar.com', 'https://www.pickaar.com'],
    credentials: true,
  },
  
  // Swagger Configuration
  swagger: {
    enabled: process.env.ENABLE_SWAGGER === 'true', // Disabled by default in production
    path: '/api-docs',
  },
  
  // Security Configuration
  security: {
    // Production: Stricter security
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit requests in production
    },
  },
  
  // Error Handling
  errorHandling: {
    showStack: false, // Don't expose stack traces in production
    showDetails: false, // Don't show detailed errors
  },
};

