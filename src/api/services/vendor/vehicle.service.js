const BaseService = require('../../base/BaseService');
const db = require('../../../models/index');
const httpStatus = require('http-status');
const APIError = require('../../../utils/APIError');
const { toObjectId } = require('../../../utils/mongoos');

/**
 * Vendor Car Service
 * Handles all vendor car-related business logic
 * Follows SOLID principles: Single Responsibility Principle
 */
class VendorCarService extends BaseService {
  /**
   * Register new car
   * @param {Object} requestParam - Car data
   * @param {String} requestParam.vendorRefPhoneNo - Vendor phone number (required)
   * @returns {Object} Success response
   */
  async registerNewVehicle(requestParam) {
    const { vendorRefId } = requestParam;
    console.log('registerNewVehicle requestParam:', requestParam);
    if (!vendorRefId) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'Vendor ID is required',
        isPublic: true,
      });
    }

    const vendorRefIdObject = toObjectId(vendorRefId);
    try {
      // Check if vendor exists and is activated
      const vendorUserObj = await this.checkEntityExists(
        db.vendor_user,
        { _id: vendorRefIdObject },
        'Vendor'
      );

      if (!vendorUserObj.profileStatus) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: `Vendor ${vendorUserObj.name}(${vendorUserObj.phoneNo}) profile is not activated. Please activate it first before mapping car.`,
          isPublic: true,
        });
      }
      // Set carFeedback default value
      const carObjWithFeedback = {
        ...requestParam,
        vendorRefId: vendorRefIdObject,
        vehicleFeedbacks: {},
      };

      const result = await db.vehicle.create(carObjWithFeedback);

      return {
        status: httpStatus.OK,
        message: 'Vehicle profile created successfully',
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
   * Get inactive car list
   * @returns {Object} List of inactive cars
   */
  async getInactiveVendorCarList() {
    try {
      const result = await db.cars.find({ status: false });

      if (result.length === 0) {
        return {
          status: httpStatus.OK,
          message: 'No inactive cars available to activate',
          data: [],
        };
      }

      return {
        status: httpStatus.OK,
        message: 'Please activate these cars',
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
   * Activate vendor car
   * @param {String} carNo - Car number
   * @returns {Object} Success response
   */
  async activateVendorCar(carNo) {
    try {
      // Check if car exists
      await this.checkEntityExists(db.cars, { carNo }, 'Car');

      const result = await db.cars.findOneAndUpdate(
        { carNo },
        { status: true },
        { new: true }
      );

      return {
        status: httpStatus.OK,
        message: `CarNo: ${carNo} status is activated`,
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
   * Deactivate vendor car
   * @param {String} carNo - Car number
   * @returns {Object} Success response
   */
  async deactivateThisVendorCar(carNo) {
    try {
      // Check if car exists
      await this.checkEntityExists(db.cars, { carNo }, 'Car');

      const result = await db.cars.findOneAndUpdate(
        { carNo },
        { status: false },
        { new: true }
      );

      return {
        status: httpStatus.OK,
        message: `CarNo: ${carNo} status is deactivated. Make sure you update your management.`,
        data: result,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }


  /**   * Get car details by car ID
   * @param {String} carId - Car ID
   * @returns {Object} Car details
   */
  async getVehicleDetailsById(vehicleId) {
    try {
      const vehicleIdObject = toObjectId(vehicleId);
      const vehicle = await this.checkEntityExists(
        db.vehicle,
        { _id: vehicleIdObject },
        'Vehicle'
      );

      return {
        status: httpStatus.OK,
        message: 'Vehicle details available',
        data: vehicle,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }

}

// Export singleton instance
module.exports = new VendorCarService();