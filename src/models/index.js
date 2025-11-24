const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const { database, environment } = require('../config/configs');
const mongoose = require('mongoose');

/**
 * Database connection handler
 * Follows SOLID principles: Single Responsibility Principle
 */
class DatabaseConnection {
  /**
   * Connect to MongoDB
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      // Use database options from config if available, otherwise use defaults
      const options = database.options || {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      await mongoose.connect(database.mongoConnectUri, options);
      
      console.log('✅ MongoDB connected successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', this.gracefulShutdown.bind(this));
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  /**
   * Graceful shutdown of database connection
   */
  async gracefulShutdown() {
    try {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed gracefully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error);
      process.exit(1);
    }
  }
}

// Initialize database connection
const dbConnection = new DatabaseConnection();
dbConnection.connect().catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

/**
 * Load all models dynamically
 * Follows DRY principle by avoiding repetitive require statements
 */
const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const fileName = file.slice(0, -3);
    db[fileName] = require(path.join(__dirname, file));
  });

module.exports = db;

