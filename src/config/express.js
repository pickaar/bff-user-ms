const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('express-async-errors'); // Handle async errors automatically

const app = express();
const config = require('./configs');
const error = require('../utils/error');
const swaggerSetup = require('./swagger');

// Security: Parse body params and attach them to req.body
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS - Cross Origin Resource Sharing
const corsOptions = config.cors || {};
app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Service is running' });
});

// Swagger API documentation
swaggerSetup(app);

// Enable API routes
app.use('/api', require('../api/routes'));

// Handle 404 - Route not found
app.use(error.notFound);

// Error handler - must be last middleware
app.use(error.converter);
app.use(error.handler);

module.exports = app;
