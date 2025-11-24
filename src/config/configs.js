require('dotenv').config();

/**
 * Configuration Loader
 * Loads environment-specific configuration based on NODE_ENV
 */

// Determine the environment
const nodeEnv = process.env.NODE_ENV || process.env.ENVIRONMENT || 'development';

// Load environment-specific configuration
let envConfig;
try {
  envConfig = require(`./environments/${nodeEnv}`);
} catch (error) {
  console.warn(`Warning: Configuration for environment "${nodeEnv}" not found. Falling back to development.`);
  envConfig = require('./environments/development');
}

// Validate required environment variables
if (nodeEnv === 'production' && !envConfig.database.mongoConnectUri) {
  throw new Error('MONGODB_URI is required in production environment');
}

// Merge with process.env overrides (process.env takes precedence)
const config = {
  ...envConfig,
  // Allow environment variables to override config
  port: process.env.PORT || envConfig.port,
  database: {
    ...envConfig.database,
    mongoConnectUri: process.env.MONGODB_URI || process.env.mongodbUri || envConfig.database.mongoConnectUri,
  },
};

// Validate required environment variables after merging
if (nodeEnv === 'production' && !config.database.mongoConnectUri) {
  throw new Error('MONGODB_URI is required in production environment. Please set MONGODB_URI in your .env file.');
}

// Log configuration status (only in development)
if (nodeEnv === 'development') {
  console.log(`\n📋 Configuration loaded for: ${config.environment}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database.mongoConnectUri ? 'Configured' : 'Not configured'}`);
  console.log(`   Swagger: ${config.swagger.enabled ? 'Enabled' : 'Disabled'}\n`);
}

module.exports = config;