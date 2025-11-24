const httpStatus = require('http-status');
const APIError = require('./APIError');
const config = require('../config/configs');

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
  const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || httpStatus[status];
  
  const response = {
    status,
    message,
    ...(err.errors && { errors: err.errors }),
  };

  // Include stack trace based on config
  if (config.errorHandling && config.errorHandling.showStack) {
    response.stack = err.stack;
  }

  res.status(status);
  res.json(response);
};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
  let error = err;
  
  if (!(err instanceof APIError)) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      error = new APIError({
        message: 'Validation Error',
        status: httpStatus.BAD_REQUEST,
        errors: Object.values(err.errors).map(e => e.message),
        isPublic: true,
      });
    }
    // Handle Mongoose cast errors (invalid ObjectId, etc.)
    else if (err.name === 'CastError') {
      error = new APIError({
        message: 'Invalid ID format',
        status: httpStatus.BAD_REQUEST,
        isPublic: true,
      });
    }
    // Handle MongoDB duplicate key errors
    else if (err.name === 'MongoServerError' && err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      error = new APIError({
        message: `${field} already exists`,
        status: httpStatus.CONFLICT,
        isPublic: true,
      });
    }
    // Generic error conversion
    else {
      error = new APIError({
        message: err.message || 'Internal server error',
        status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
        isPublic: err.isPublic || false,
        stack: err.stack,
      });
    }
  }

  return handler(error, req, res, next);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: `Route ${req.originalUrl} not found`,
    status: httpStatus.NOT_FOUND,
    isPublic: true,
  });
  return handler(err, req, res, next);
};

/**
 * Export handler for use in Express app
 */
exports.handler = handler;
