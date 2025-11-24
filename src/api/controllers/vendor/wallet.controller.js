const BaseController = require('../../base/BaseController');
const vWalletService = require('../../services/vendor/wallet.service');
const httpStatus = require('http-status');

/**
 * Vendor Wallet Controller
 * Handles all vendor wallet-related operations
 * Follows SOLID principles: Single Responsibility Principle
 */
class VendorWalletController extends BaseController {
  /**
   * Create new wallet
   * @swagger
   * /api/vendor/wallet/new:
   *   post:
   *     summary: Create a new wallet
   *     tags: [Vendor - Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Wallet created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  createNewWallet = this.asyncHandler(async (req, res) => {
    const result = await vWalletService.createNewWallet(req.body);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Recharge wallet
   * @swagger
   * /api/vendor/wallet/recharge:
   *   post:
   *     summary: Recharge wallet
   *     tags: [Vendor - Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - vendorPhoneNo
   *               - amount
   *             properties:
   *               vendorPhoneNo:
   *                 type: string
   *               schemeType:
   *                 type: string
   *               amount:
   *                 type: number
   *               paymentVia:
   *                 type: string
   *               paymentStatus:
   *                 type: string
   *     responses:
   *       200:
   *         description: Wallet recharged successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  recharge = this.asyncHandler(async (req, res) => {
    const { vendorPhoneNo, schemeType, amount, paymentVia, paymentStatus } = req.body;
    
    this.validateRequired(req.body, ['vendorPhoneNo', 'amount']);
    
    const result = await vWalletService.recharge({
      vendorPhoneNo,
      schemeType,
      amount,
      paymentVia,
      paymentStatus,
    });
    
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Get wallet details
   * @swagger
   * /api/vendor/wallet/{phoneNo}:
   *   get:
   *     summary: Get wallet details
   *     tags: [Vendor - Wallet]
   *     parameters:
   *       - in: path
   *         name: phoneNo
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Wallet details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  getWalletDetail = this.asyncHandler(async (req, res) => {
    const { phoneNo } = req.params;
    
    this.validateRequired({ phoneNo }, ['phoneNo']);
    
    const result = await vWalletService.getWalletDetail(phoneNo);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Get payment details
   * @swagger
   * /api/vendor/wallet/payments/{phoneNo}:
   *   get:
   *     summary: Get payment details
   *     tags: [Vendor - Wallet]
   *     parameters:
   *       - in: path
   *         name: phoneNo
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Payment details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  getPaymentsDetails = this.asyncHandler(async (req, res) => {
    const { phoneNo, limit } = req.params;
    const limitValue = parseInt(limit || req.query?.limit || 10, 10);
    
    this.validateRequired({ phoneNo }, ['phoneNo']);
    
    const result = await vWalletService.getPaymentsDetails(phoneNo, limitValue);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Deduct amount from wallet (used by booking API)
   * @swagger
   * /api/vendor/wallet/deduct:
   *   post:
   *     summary: Deduct amount from wallet
   *     tags: [Vendor - Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Amount deducted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   */
  WalletDeductAmt = this.asyncHandler(async (req, res) => {
    // TODO: Implement wallet deduction logic
    return this.sendSuccess(res, null, httpStatus.OK, 'Wallet deduction endpoint - implementation pending');
  });
}

// Export singleton instance
module.exports = new VendorWalletController();