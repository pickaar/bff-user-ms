const BaseController = require('../../base/BaseController');
const vUserService = require('../../services/vendor/user.service');
const httpStatus = require('http-status');

/**
 * Vendor User Controller
 * Handles all vendor user-related operations
 * Follows SOLID principles: Single Responsibility Principle
 */
class VendorUserController extends BaseController {
  /**
   * Create new vendor user
   * @swagger
   * /api/vendor/user/newuser:
   *   post:
   *     summary: Create a new vendor user
   *     tags: [Vendor - User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - phoneNo
   *               - address
   *               - exp
   *               - languagesKnown
   *               - optedFor
   *             properties:
   *               name:
   *                 type: string
   *               phoneNo:
   *                 type: string
   *               address:
   *                 type: string
   *               exp:
   *                 type: number
   *               languagesKnown:
   *                 type: array
   *                 items:
   *                   type: string
   *               optedFor:
   *                 type: string
   *               aboutUs:
   *                 type: string
   *     responses:
   *       200:
   *         description: Vendor user created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  newUser = this.asyncHandler(async (req, res) => {
    const result = await vUserService.createNewVendoruser(req.body);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Get list of inactive vendors
   * @swagger
   * /api/vendor/user/inactivelist:
   *   get:
   *     summary: Get list of inactive vendors
   *     tags: [Vendor - User]
   *     responses:
   *       200:
   *         description: List of inactive vendors
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   */
  inactiveList = this.asyncHandler(async (req, res) => {
    const result = await vUserService.getInactiveVendorList();
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Activate a vendor
   * @swagger
   * /api/vendor/user/activate:
   *   put:
   *     summary: Activate a vendor account
   *     tags: [Vendor - User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - phoneNo
   *             properties:
   *               phoneNo:
   *                 type: string
   *     responses:
   *       200:
   *         description: Vendor activated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  activateVendor = this.asyncHandler(async (req, res) => {
    const { phoneNo } = req.body;
    
    this.validateRequired(req.body, ['phoneNo']);
    
    const result = await vUserService.activateThisVendor(phoneNo);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Deactivate a vendor
   * @swagger
   * /api/vendor/user/deactivate:
   *   put:
   *     summary: Deactivate a vendor account
   *     tags: [Vendor - User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - phoneNo
   *             properties:
   *               phoneNo:
   *                 type: string
   *     responses:
   *       200:
   *         description: Vendor deactivated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  deactivateVendor = this.asyncHandler(async (req, res) => {
    const { phoneNo } = req.body;
    
    this.validateRequired(req.body, ['phoneNo']);
    
    const result = await vUserService.deactivateThisVendor(phoneNo);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });
}

// Export singleton instance
module.exports = new VendorUserController();
