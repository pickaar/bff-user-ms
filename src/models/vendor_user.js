const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleFeedback = new Schema({
    ac: { type: Number, default: 5 },
    cleaness: { type: Number, default: 5 },
    comfort: { type: Number, default: 5 },
    overAll: { type: Number, default: 5 }
})
const vendorUserModel = mongoose.model('vendor_user', new Schema({
    name: { type: String, required: true },
    phoneNo: { type: Number, required: true, unique: true },
    address: { type: String, required: true },
    profileStatus: { type: Boolean, default: false },
    age: { type: Number, required: true },
    exp: { type: Number, required: true },
    aboutUs: { type: String, default: 'Passionate of driving.' },
    languagesKnown: { type: [String], required: true },
    optedFor: { type: Number, enum: [1, 2, 3] },// Subscription plans
    vendorFeedbacks: { type: vehicleFeedback, default: {} },
    updatedOn: { type: Date, default: Date.now },
    completedTrips: { type: Number, default: 0 }
}));

vendorUserModel.createIndexes({ profileStatus: 1, phoneNo: 1 });

module.exports = vendorUserModel;
