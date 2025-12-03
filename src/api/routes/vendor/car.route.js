const express = require('express');
const router = express.Router();
const controller = require('../../controllers/vendor/car.controller');

/**
 * @swagger
 * tags:
 *   name: Vendor - Car
 *   description: Vendor car management endpoints
 */

router.route('/newCar').post(controller.newCarRegistration);
router.route('/CarInactivelist').get(controller.inactiveCarList);
router.route('/activate/:carNo').put(controller.activateVendorCar);
router.route('/deactivate/:carNo').put(controller.deactivateVendorCar);
router.route('/getCardById/:carId').put(controller.getCarById);


module.exports = router;