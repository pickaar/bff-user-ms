const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('cust_rides_history', new Schema({
    bookingId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    fromAddress: String,
    toAddress: String,
    date: String,
    price: String,
    vendorId: String
}));