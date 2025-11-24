const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorUserModel = mongoose.model('vendor_users', new Schema({
    name: { type: String, required: true },
    phoneNo: { type: Number, required: true, unique: true },
    address: { type: String, required: true },
    profileStatus: { type: Boolean, default: false },
    age: { type: Number, required: true },
    exp: { type: Number, required: true },
    aboutUs: { type: String, default: 'Passionate of driving.' },
    languagesKnown: { type: [String], required: true },
    optedFor: { type: Number, enum: [1, 2, 3] },
    updatedOn: { type: Date, default: Date.now }
}));

vendorUserModel.createIndexes({ profileStatus: 1, phoneNo: 1 });

module.exports = vendorUserModel;
