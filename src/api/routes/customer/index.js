const express = require('express');
const router = express.Router();

/**
 * @route /api/cust/user
 */
const custUserRoute = require('./user.route');
const ridesRoute = require('./rides.route');

router.use('/user', custUserRoute);
router.use('/rides', ridesRoute);


module.exports = router;