const BaseService = require('../../base/BaseService');
const db = require('../../../models/index');
const httpStatus = require('http-status');
const APIError = require('../../../utils/APIError');
const { toObjectId } = require('../../../utils/mongoos');

/**
 * Vendor User Service
 * Handles all vendor user-related business logic
 * Follows SOLID principles: Single Responsibility Principle
 */
class VendorUserService extends BaseService {
  /**
   * Create new vendor user
   * @param {Object} requestObj - Vendor user data
   * @returns {Object} Success response
   *
   */
  async createNewVendoruser(requestObj) {
    try {
      const result = await db.vendor_user.create(requestObj);
      return {
        status: httpStatus.OK,
        message: 'Vendor profile created successfully',
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
   * Get list of inactive vendors
   * @returns {Object} List of inactive vendors
   */
  async getInactiveVendorList() {
    try {
      const result = await db.vendoruser.find({ profileStatus: false });

      if (result.length === 0) {
        return {
          status: httpStatus.OK,
          message: 'No inactive vendor profiles available',
          data: [],
        };
      }

      return {
        status: httpStatus.OK,
        message: 'Please activate these vendor profiles ASAP',
        data: result,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }

  async getVendorUserByID(vendorUserId) {
    try {
      const vendorUserIdObject = toObjectId(vendorUserId);
      const findQuery = { _id: vendorUserIdObject };

      // Check if vendor exists
      const result = await this.checkEntityExists(
        db.vendor_user,
        findQuery,
        'Vendor'
      );

      return {
        status: httpStatus.OK,
        message: 'Vendor user fetched successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error in getVerdorUserByID:', error);
      if (error instanceof APIError) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }


  /**
   * Activate a vendor
   * @param {String} vendorPhoneNo - Vendor phone number
   * @returns {Object} Success response
   */
  async activateThisVendor(vendorPhoneNo) {
    try {
      // Check if vendor exists
      await this.checkEntityExists(
        db.vendor_user,
        { phoneNo: vendorPhoneNo },
        'Vendor'
      );

      const result = await db.vendor_user.findOneAndUpdate(
        { phoneNo: vendorPhoneNo },
        { profileStatus: true },
        { new: true }
      );

      return {
        status: httpStatus.OK,
        message: `Vendor profile ${vendorPhoneNo} is activated`,
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
   * Deactivate a vendor
   * @param {String} vendorPhoneNo - Vendor phone number
   * @returns {Object} Success response
   */
  async deactivateThisVendor(vendorPhoneNo) {
    try {
      // Check if vendor exists
      await this.checkEntityExists(
        db.vendoruser,
        { phoneNo: vendorPhoneNo },
        'Vendor'
      );

      const result = await db.vendoruser.findOneAndUpdate(
        { phoneNo: vendorPhoneNo },
        { profileStatus: false },
        { new: true }
      );

      return {
        status: httpStatus.OK,
        message: `Vendor profile ${vendorPhoneNo} is deactivated. Make sure you update your management.`,
        data: result,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }

  async getVendorAndVehicleInBatch(vendorIds, vehicleIds) {
    try {

      // Convert string IDs to Mongoose ObjectIds for the query
      const vendorObjectIds = vendorIds.map(toObjectId);
      const vehicleObjectIds = vehicleIds.map(toObjectId);
      // Fetch data concurrently using Promise.all
      const [vendors, vehicles] = await Promise.all([
        db.vendor_user.find({ _id: { $in: vendorObjectIds } }).lean().exec(),
        db.vehicle.find({ _id: { $in: vehicleObjectIds } }).lean().exec()
      ]);
      // Map the results into lookup objects (maps) for easy merging later
      const vendorMap = vendors.reduce((acc, vendor) => {
        acc[vendor._id.toString()] = vendor;
        return acc;
      }, {});

      const vehicleMap = vehicles.reduce((acc, vehicle) => {
        acc[vehicle._id.toString()] = vehicle;
        return acc;
      }, {});
      return {
        result: httpStatus.OK,
        message: 'Successfully fetched vendor and vehicle details.',
        data: {
          vendorMap,
          vehicleMap
        }
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
module.exports = new VendorUserService();