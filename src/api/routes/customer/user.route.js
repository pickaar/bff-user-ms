const express = require('express');
const router = express.Router();
const controller = require('../../controllers/customer/user.controller');

/**
 * @swagger
 * tags:
 *   name: Customer - User
 *   description: Customer user management endpoints
 */

router.route('/testAPI').post(controller.testAPI);

/**
 * Sent OTP to user phone number
 */
router.route('/sendOTP/:phoneNo?').post(controller.sendOTP);


/**
 * Get user details by phone number (query param or path param)
 */
router.route('/fetchUser/:phoneNo?').get(controller.getUserDetail);

/**
 * Create new customer user
 */
router.route('/createUser').post(controller.newUser);

/**
 * Update customer user information
 */
router.route('/updateUser').put(controller.updateUser);

module.exports = router;