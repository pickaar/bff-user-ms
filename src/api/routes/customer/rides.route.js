const express = require('express');
const router = express.Router();
const controller = require('../../controllers/customer/rides.controller');

/**
 * @swagger
 * tags:
 *   name: Customer - Rides
 *   description: Customer ride management endpoints
 */

router.route('/').post(controller.saveNewRide);

module.exports = router;