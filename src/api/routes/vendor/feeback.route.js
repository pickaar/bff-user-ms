const express = require('express');
const router = express.Router();
const controller = require('../../controllers/vendor/feedback.controller');

/**
 * @swagger
 * tags:
 *   name: Vendor - Feedback
 *   description: Vendor feedback management endpoints
 */

router.route('/create').post(controller.createFeedback );
router.route('/getFeedbackById/:vendorId').get(controller.getFeedbackByVendor);


module.exports = router;