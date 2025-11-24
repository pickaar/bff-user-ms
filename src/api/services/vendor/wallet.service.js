const BaseService = require('../../base/BaseService');
const db = require('../../../models/index');
const { currentDate, addMonth } = require('../../helpers/utils');
const httpStatus = require('http-status');
const APIError = require('../../../utils/APIError');

/**
 * Vendor Wallet Service
 * Handles all vendor wallet-related business logic
 * Follows SOLID principles: Single Responsibility Principle
 */
class VendorWalletService extends BaseService {
  /**
   * Create new wallet
   * @param {Object} walletObj - Wallet data
   * @param {String} walletObj.vendorPhoneNo - Vendor phone number (required)
   * @param {Number} walletObj.walletAmt - Initial wallet amount
   * @returns {Object} Success response
   */
  async createNewWallet(walletObj) {
    const { vendorPhoneNo, walletAmt } = walletObj;

    if (!vendorPhoneNo) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'Vendor phone number is mandatory',
        isPublic: true,
      });
    }

    try {
      // Check if vendor exists and is activated
      const vendorUserObj = await this.checkEntityExists(
        db.vendoruser,
        { phoneNo: vendorPhoneNo },
        'Vendor'
      );

      if (!vendorUserObj.profileStatus) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: `Vendor ${vendorUserObj.name}(${vendorUserObj.phoneNo}) profile is not activated. Please activate it first.`,
          isPublic: true,
        });
      }

      // To create new wallet, schemeType should always be 2 (Cost for each trip)
      const walletData = {
        ...walletObj,
        schemeType: 2,
        monthlyStartDate: currentDate(),
        monthlyEndDate: currentDate(),
      };

      const result = await db.wallets.create(walletData);

      // Insert initial payment record
      await this.insertIntoPayments(
        vendorPhoneNo,
        'ON_LAUNCH_OFFER',
        walletAmt || 0,
        'COMPLETED'
      );

      return {
        status: httpStatus.OK,
        message: 'Wallet account created successfully',
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
   * Recharge wallet
   * @param {Object} params - Recharge parameters
   * @param {String} params.vendorPhoneNo - Vendor phone number
   * @param {Number} params.schemeType - Scheme type (1: Monthly, 2: Cost per trip)
   * @param {String} params.paymentVia - Payment method
   * @param {Number} params.amount - Recharge amount
   * @param {String} params.paymentStatus - Payment status
   * @returns {Object} Success response
   */
  async recharge({ vendorPhoneNo, schemeType, paymentVia, amount, paymentStatus }) {
    try {
      // Check if wallet account exists
      const walletAccount = await this.checkEntityExists(
        db.wallets,
        { vendorPhoneNo },
        'Wallet account'
      );

      if (!schemeType) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: 'SchemeType is mandatory. Pass 1 for Monthly Scheme and 2 for Cost for Each trip scheme.',
          isPublic: true,
        });
      }

      // Insert payment history
      await this.insertIntoPayments(vendorPhoneNo, paymentVia, amount, paymentStatus);

      // Handle recharge based on scheme type
      if (schemeType === 1) {
        return await this.monthlySchemeRecharge(vendorPhoneNo, walletAccount, amount);
      }

      if (schemeType === 2) {
        return await this.costForEachTripRecharge(vendorPhoneNo, walletAccount, amount);
      }

      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'Invalid scheme type. Use 1 for Monthly or 2 for Cost per trip',
        isPublic: true,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }

  /**
   * Monthly scheme recharge
   * @private
   * @param {String} vendorPhoneNo - Vendor phone number
   * @param {Object} walletAccount - Existing wallet account
   * @param {Number} amount - Recharge amount
   * @returns {Object} Success response
   */
  async monthlySchemeRecharge(vendorPhoneNo, walletAccount, amount) {
    const startDate = currentDate();
    const endDate = addMonth(walletAccount.monthlyEndDate, 1);

    const walletObj = {
      status: true,
      monthlyStartDate: startDate,
      monthlyEndDate: endDate,
      vendorPhoneNo,
      schemeType: 1, // Monthly Scheme
    };

    const result = await db.wallets.findOneAndUpdate(
      { vendorPhoneNo },
      walletObj,
      { new: true, upsert: false }
    );

    if (!result) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: `Unable to find vendor ${vendorPhoneNo} in wallet table`,
        isPublic: true,
      });
    }

    return {
      status: httpStatus.OK,
      message: 'Wallet amount updated in Monthly Scheme',
      data: result,
    };
  }

  /**
   * Cost for each trip recharge
   * @private
   * @param {String} vendorPhoneNo - Vendor phone number
   * @param {Object} walletAccount - Existing wallet account
   * @param {Number} amount - Recharge amount
   * @returns {Object} Success response
   */
  async costForEachTripRecharge(vendorPhoneNo, walletAccount, amount) {
    const updatedWalletAmt = (walletAccount.walletAmt || 0) + amount;

    const walletObj = {
      status: true,
      vendorPhoneNo,
      schemeType: 2, // CostForEachTrip Scheme
      walletAmt: updatedWalletAmt,
    };

    const result = await db.wallets.findOneAndUpdate(
      { vendorPhoneNo },
      walletObj,
      { new: true, upsert: false }
    );

    if (!result) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: `Unable to find vendor ${vendorPhoneNo} in wallet table`,
        isPublic: true,
      });
    }

    return {
      status: httpStatus.OK,
      message: `Wallet amount updated in CostForEachTrip scheme. Existing Amount: ${walletAccount.walletAmt || 0} + Added Amount ${amount} = Current Wallet Amount: ${updatedWalletAmt}`,
      data: result,
    };
  }

  /**
   * Insert payment record
   * @private
   * @param {String} vendorPhoneNo - Vendor phone number
   * @param {String} paymentVia - Payment method
   * @param {Number} amount - Payment amount
   * @param {String} paymentStatus - Payment status
   * @returns {Promise<void>}
   */
  async insertIntoPayments(vendorPhoneNo, paymentVia, amount, paymentStatus) {
    try {
      const paymentsResult = await db.payments.create({
        vendorPhoneNo,
        paymentVia,
        amount,
        Date: currentDate(),
        status: paymentStatus,
      });

      if (!paymentsResult) {
        throw new APIError({
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: `Unable to create payment record for vendor ${vendorPhoneNo}`,
          isPublic: false,
        });
      }
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }

  /**
   * Get wallet details
   * @param {String} phoneNo - Vendor phone number
   * @returns {Object} Wallet details
   */
  async getWalletDetail(phoneNo) {
    try {
      const wallet = await this.checkEntityExists(
        db.wallets,
        { vendorPhoneNo: phoneNo },
        'Wallet'
      );

      return {
        status: httpStatus.OK,
        message: 'Wallet detail',
        data: wallet,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }

  /**
   * Get payment details
   * @param {String} phoneNo - Vendor phone number
   * @param {Number} limit - Number of records to return
   * @returns {Object} Payment details
   */
  async getPaymentsDetails(phoneNo, limit = 10) {
    try {
      const result = await db.payments
        .find({ vendorPhoneNo: phoneNo })
        .sort({ _id: -1 })
        .limit(parseInt(limit, 10));

      if (result.length === 0) {
        return {
          status: httpStatus.OK,
          message: `No payment history found for vendor ${phoneNo}`,
          data: [],
        };
      }

      return {
        status: httpStatus.OK,
        message: `Last ${limit} payments history of vendor ${phoneNo}`,
        data: result,
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
module.exports = new VendorWalletService();