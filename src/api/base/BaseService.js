const httpStatus = require('http-status');
const APIError = require('../../utils/APIError');

/**
 * Base Service class following SOLID principles
 * Provides common functionality for all services (DRY principle)
 */
class BaseService {
  /**
   * Handle database errors and convert to API errors
   * @param {Error} error - Database error
   * @throws {APIError} - Converted API error
   */
  handleDatabaseError(error) {
    if (error.name === 'ValidationError') {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: error.message,
        isPublic: true,
      });
    }

    if (error.name === 'MongoServerError' && error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw new APIError({
        status: httpStatus.CONFLICT,
        message: `${field} already exists`,
        isPublic: true,
      });
    }

    throw new APIError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database operation failed',
      isPublic: false,
    });
  }

  /**
   * Check if entity exists
   * @param {Object} model - Mongoose model
   * @param {Object} query - Query object
   * @param {String} entityName - Name of the entity for error message
   * @throws {APIError} - If entity doesn't exist
   */
  async checkEntityExists(model, query, entityName = 'Entity') {
    const entity = await model.findOne(query);
    
    if (!entity) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: `${entityName} not found`,
        isPublic: true,
      });
    }
    
    return entity;
  }

  /**
   * Check if entity already exists (for create operations)
   * @param {Object} model - Mongoose model
   * @param {Object} query - Query object
   * @param {String} entityName - Name of the entity for error message
   * @throws {APIError} - If entity already exists
   */
  async checkEntityNotExists(model, query, entityName = 'Entity') {
    const entity = await model.findOne(query);
    
    if (entity) {
      throw new APIError({
        status: httpStatus.CONFLICT,
        message: `${entityName} already exists`,
        isPublic: true,
      });
    }
  }

  /**
   * Build update object from request data
   * Only includes fields that are provided (not null/undefined)
   * @param {Object} data - Request data
   * @param {Array} allowedFields - Array of allowed field names
   * @returns {Object} - Update object
   */
  buildUpdateObject(data, allowedFields) {
    const updateObj = {};
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== null) {
        updateObj[field] = data[field];
      }
    });
    
    return updateObj;
  }
}

module.exports = BaseService;

