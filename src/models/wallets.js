const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const walletsModel = mongoose.model('vendor_wallets', new Schema({
    status: { type: Boolean, default: true },
    vendorPhoneNo: { type: Number, unique: true, required: true },
    schemeType: { type: Number, enum: [1, 2] },
    walletAmt: { type: Number, required: true },
    monthlyStartDate: { type: String },
    monthlyEndDate: { type: String },
    privilegedAccount: { type: Boolean, default: false }
}))

walletsModel.createIndexes({ vendorPhoneNo: 1 });

module.exports = walletsModel;