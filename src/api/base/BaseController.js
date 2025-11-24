const httpStatus = require('http-status');
const APIError = require('../../utils/APIError');

/**
 * Base Controller class following SOLID principles
 * Provides common functionality for all controllers (DRY principle)
 */
class BaseController {
  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {Object} data - Response data
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Success message
   */
  sendSuccess(res, data = null, statusCode = httpStatus.OK, message = 'Success') {
    return res.status(statusCode).json({
      status: statusCode,
      message,
      data,
    });
  }

  /**
   * Send error response
   * @param {Object} res - Express response object
   * @param {Error|Object} error - Error object
   * @param {Number} statusCode - HTTP status code
   */
  sendError(res, error, statusCode = null) {
    const status = statusCode || error.status || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal server error';
    
    return res.status(status).json({
      status,
      message,
      ...(process.env.ENVIRONMENT === 'development' && { stack: error.stack }),
    });
  }

  /**
   * Async handler wrapper to catch errors automatically
   * Follows DRY principle by eliminating repetitive try-catch blocks
   * @param {Function} fn - Async function to wrap
   * @returns {Function} - Express middleware function
   */
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Validate required fields
   * @param {Object} data - Data object to validate
   * @param {Array} requiredFields - Array of required field names
   * @throws {APIError} - If validation fails
   */
  validateRequired(data, requiredFields) {
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        isPublic: true,
      });
    }
  }
}

module.exports = BaseController;

