const express = require('express');
const router = express.Router();

/**
 * @route /api/vendor/user
 */
const vendorUserRoute = require('./user.route');
const vendorVehicleRoute = require('./vehicle.route');
const vendorWalletRoute = require('./wallet.route');
const vendorFeedbackRoute = require('./feeback.route');

router.use('/user', vendorUserRoute);
router.use('/vehicle', vendorVehicleRoute);
router.use('/wallet', vendorWalletRoute);
router.use('/feedback', vendorFeedbackRoute);



module.exports = router;