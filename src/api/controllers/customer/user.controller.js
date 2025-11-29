const BaseController = require('../../base/BaseController');
const userService = require('../../services/customer/user.service');
const httpStatus = require('http-status');

/**
 * Customer User Controller
 * Handles all customer user-related operations
 * Follows SOLID principles: Single Responsibility Principle
 */
class CustomerUserController extends BaseController {
  /**
   * @swagger
   * /api/cust/user/testAPI:
   *   post:
   *     summary: Test API endpoint
   *     tags: [Customer - User]
   *     responses:
   *       200:
   *         description: API is working
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   */
  testAPI = this.asyncHandler(async (req, res) => {
    return this.sendSuccess(res, null, httpStatus.OK, 'API is working');
  });

 /**
   * Get user details by phone number
   * @swagger
   * /api/cust/user/sendOTP/{phoneNo}:
   *   post:
   *     summary: Get customer user details
   *     tags: [Customer - User]
   *     parameters:
   *       - in: query
   *         name: phoneNo
   *         required: true
   *         schema:
   *           type: string
   *         description: User phone number
   *     responses:
   *       200:
   *         description: User details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  sendOTP = this.asyncHandler(async (req, res) => {
    const phoneNo = req.body?.phoneNo || req.params?.phoneNo;
    this.validateRequired({ phoneNo }, ['phoneNo']);

    const result = await userService.sendOTP(phoneNo);
    
    return this.sendSuccess(res, result?.data?.request_id || null, httpStatus.OK, 'OTP sent successfully');
  });

  /**
   * Get user details by phone number
   * @swagger
   * /api/cust/user/fetchUser/{phoneNo}:
   *   get:
   *     summary: Get customer user details
   *     tags: [Customer - User]
   *     parameters:
   *       - in: query
   *         name: phoneNo
   *         required: true
   *         schema:
   *           type: string
   *         description: User phone number
   *     responses:
   *       200:
   *         description: User details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  getUserDetail = this.asyncHandler(async (req, res) => {
    const phoneNo = req.query?.phoneNo || req.params?.phoneNo;

    this.validateRequired({ phoneNo }, ['phoneNo']);
    
    const result = await userService.getUserDetail(phoneNo);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Create new customer user
   * @swagger
   * /api/cust/user/createUser:
   *   post:
   *     summary: Create a new customer user
   *     tags: [Customer - User]
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
   *                 description: User phone number
   *     responses:
   *       200:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       409:
   *         description: User already exists
   */
  newUser = this.asyncHandler(async (req, res) => {
    const { otp ,phoneNo} = req.body;
    this.validateRequired(req.body, ['otp','phoneNo']);
    
    const result = await userService.createNewUser({ otp, phoneNo });
    
    if (result.status !== httpStatus.OK) {
      return this.sendSuccess(res, null, result.status, result.message);
    }

    return this.sendSuccess(res, null, httpStatus.OK, result.message);
  });

  /**
   * Update customer user information
   * @swagger
   * /api/cust/user/user:
   *   put:
   *     summary: Update customer user information
   *     tags: [Customer - User]
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
   *                 description: User phone number
   *               username:
   *                 type: string
   *                 description: Username
   *               emailId:
   *                 type: string
   *                 description: Email ID
   *               locations:
   *                 type: array
   *                 description: User locations
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  updateUser = this.asyncHandler(async (req, res) => {
    this.validateRequired(req.body, ['phoneNo']);
    
    const result = await userService.updateUserObj(req.body);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });
}

// Export singleton instance
module.exports = new CustomerUserController();