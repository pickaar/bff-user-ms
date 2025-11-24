const express = require('express');
const router = express.Router();


/**
 * @title Customer - Route
 * @description Initialize all customer API routes and make it accessable to /api/cust
 * @route /api/cust
 */
router.use('/cust', require('./customer'));


/**
 * @title Customer - Route
 * @description Initialize all customer API routes and make it accessable to /api/cust
 * @route /api/vendor
 */
router.use('/vendor', require('./vendor'));

module.exports = router;