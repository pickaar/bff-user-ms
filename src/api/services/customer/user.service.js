const BaseService = require('../../base/BaseService');
const db = require('../../../models/index');
const httpStatus = require('http-status');
const APIError = require('../../../utils/APIError');
const axios = require('axios');
/**
 * Customer User Service
 * Handles all customer user-related business logic
 * Follows SOLID principles: Single Responsibility Principle
 */
class CustomerUserService extends BaseService {
  /**
   * Send OTP to user phone number
   * @param {String} phoneNo - User phone number
   * @returns {Object} Success response
   */
  async sendOTP(phoneNo) {
    try {

      //MSG91 sms service 
      // const MSG91_AUTHKEY = process.env.MSG91_AUTHKEY;
      // const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
      // const OTP_API_URL = 'https://control.msg91.com/api/v5/otp';

      // const response = await axios.post(OTP_API_URL, {
      //   template_id: MSG91_TEMPLATE_ID,
      //   mobile: phoneNo,
      // }, {
      //   headers: {
      //     authkey: MSG91_AUTHKEY,
      //     'Content-Type': 'application/json',
      //   },
      // });
      console.log("Phone Number in Service:", phoneNo);
      if (true) { //if (response.data.type === 'success') 
        // You may want to store the request_id returned by MSG91 for logging or verification
        return { data: { request_id: 'dummy_request_id' } }; //response.data;
      } else {
        // Handle known MSG91 error responses
        console.error('MSG91 Send Error:', response.data);
        return res.status(500).json({ success: false, message: 'Failed to send OTP (MSG91 Error)' });
      }


    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }


  /**
   * Get user details by phone number
   * @param {String} phoneNo - User phone number
   * @returns {Object} User details
   */
  async getUserDetail(phoneNo) {
    try {
      const user = await this.checkEntityExists(
        db.custuser,
        { phoneNo },
        'User'
      );

      return {
        status: httpStatus.OK,
        message: 'User details available',
        data: user,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }

  /**
   * Create new customer user
   * @param {Object} userData - User data
   * @param {String} userData.phoneNo - User phone number
   * @returns {Object} Success response
   */
  async createNewUser({ otp,phoneNo }) {
    try {
      //Step 1: Validate OTP to be added here in future

      // if (true) {
      //   return {
      //     status: httpStatus.UNAUTHORIZED,
      //     message: 'Seems like entered OTP is not valid.',
      //   };
      // }
 
      // Step 2: Create new user
      const result = await db.custuser.create({ phoneNo });

      return {
        status: httpStatus.OK,
        message: 'New user created successfully',
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
   * Update user information
   * @param {Object} requestObj - Update data
   * @param {String} requestObj.phoneNo - User phone number (required)
   * @param {String} [requestObj.username] - Username
   * @param {String} [requestObj.emailId] - Email ID
   * @param {Array} [requestObj.locations] - User locations
   * @returns {Object} Success response
   */
  async updateUserObj(requestObj) {
    const { phoneNo, locations, username, emailId } = requestObj;

    try {
      // Check if user exists
      await this.checkEntityExists(
        db.custuser,
        { phoneNo },
        'User'
      );

      // Build update object using base service method
      const updateObj = this.buildUpdateObject(
        { username, emailId, locations },
        ['username', 'emailId', 'locations']
      );

      if (Object.keys(updateObj).length === 0) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: 'No valid fields to update',
          isPublic: true,
        });
      }

      const updateResult = await db.custuser.updateOne(
        { phoneNo },
        { $set: updateObj }
      );

      if (updateResult.matchedCount === 0) {
        throw new APIError({
          status: httpStatus.NOT_FOUND,
          message: 'User not found',
          isPublic: true,
        });
      }

      return {
        status: httpStatus.OK,
        message: `Information updated successfully. User PhoneNo: ${phoneNo}`,
        data: updateResult,
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
module.exports = new CustomerUserService();