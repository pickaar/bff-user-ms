const BaseService = require('../../base/BaseService');
const db = require('../../../models/index');
const httpStatus = require('http-status');
const APIError = require('../../../utils/APIError');

/**
 * Customer Rides Service
 * Handles all customer ride-related business logic
 * Follows SOLID principles: Single Responsibility Principle
 */
class CustomerRidesService extends BaseService {
  /**
   * Save new ride
   * @param {Object} ridesObj - Ride data
   * @param {String} ridesObj.bookingId - Booking ID
   * @param {String} ridesObj.userId - User ID
   * @returns {Object} Success response
   */
  async saveNewRides(ridesObj) {
    const { bookingId, userId } = ridesObj;

    if (!bookingId || !userId) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'BookingId and UserId are required',
        isPublic: true,
      });
    }

    try {
      const rideModel = new db.custrideshistory(ridesObj);
      const result = await rideModel.save();

      return {
        status: httpStatus.OK,
        message: 'Ride saved successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }

  /**
   * Get rides (placeholder for future implementation)
   * @returns {Object} Rides list
   */
  async getRides() {
    // TODO: Implement get rides functionality
    return {
      status: httpStatus.OK,
      message: 'Get rides functionality not yet implemented',
      data: [],
    };
  }
}

// Export singleton instance
module.exports = new CustomerRidesService();