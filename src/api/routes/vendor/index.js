const express = require('express');
const router = express.Router();

/**
 * @route /api/vendor/user
 */
const vendorUserRoute = require('./user.route');
const vendorCarRoute = require('./car.route');
const vendorWalletRoute = require('./wallet.route');

router.use('/user', vendorUserRoute);
router.use('/car', vendorCarRoute);
router.use('/wallet', vendorWalletRoute);


module.exports = router;