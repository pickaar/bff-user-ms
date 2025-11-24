const express = require('express');
const router = express.Router();
const controller = require('../../controllers/vendor/wallet.controller');

/**
 * @swagger
 * tags:
 *   name: Vendor - Wallet
 *   description: Vendor wallet management endpoints
 */

router.route('/wallet').post(controller.createNewWallet);
router.route('/Recharge').put(controller.recharge);
router.route('/wallet/:phoneNo').get(controller.getWalletDetail);
router.route('/payments/:phoneNo').get(controller.getPaymentsDetails);
router.route('/payments/:phoneNo/:limit').get(controller.getPaymentsDetails);
router.route('/WalletDeductAmt').post(controller.WalletDeductAmt);

module.exports = router;