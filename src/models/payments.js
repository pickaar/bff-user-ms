const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentModel = mongoose.model('payments', new Schema({
    vendorPhoneNo: { type: Number, required: true },
    paymentVia: { type: String, required: true },
    amount: { type: Number, required: true },
    Date: { type: String, required: true },
    status: { type: String, required: true }
}))

paymentModel.createIndexes({ vendorPhoneNo: 1 });
module.exports = paymentModel;