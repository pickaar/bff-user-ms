const express = require('express');
const router = express.Router();
const controller = require('../../controllers/vendor/user.controller');

/**
 * @swagger
 * tags:
 *   name: Vendor - User
 *   description: Vendor user management endpoints
 */

router.route('/newuser').post(controller.newUser);
router.route('/getVendorById/:vendorUserId?').get(controller.getVendorUserByID);
// router.route('/inactivelist').get(controller.inactiveList);
router.route('/activate').put(controller.activateVendor);
router.route('/deactivate').put(controller.deactivateVendor);
//Used in BookingMS to fetch vendor & Vehicle in batch
router.route('/batch-details').post(controller.getbatchDetails);


module.exports = router;