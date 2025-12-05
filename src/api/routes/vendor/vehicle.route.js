const express = require('express');
const router = express.Router();
const controller = require('../../controllers/vendor/vehicle.controller');

/**
 * @swagger
 * tags:
 *   name: Vendor - Vehicle
 *   description: Vendor vehicle management endpoints
 */

router.route('/newVehicle').post(controller.newVehicleRegistration);
// router.route('/VehicleInactivelist').get(controller.inactiveVehicleList);
// router.route('/activate/:vehicleNo').put(controller.activateVendorVehicle);
// router.route('/deactivate/:vehicleNo').put(controller.deactivateVendorVehicle);
router.route('/getVehicleById/:vehicleId').get(controller.getVehicleById);


module.exports = router;