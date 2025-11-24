const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const address = new Schema({
    name: { type: String },
    latlng: { type: { type: String, default: "Point" }, coordinates: [Number] },
    flatHouseNo: { type: String, required: true },
    buildingStreet: { type: String },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    landmark: { type: String },
    pincode: { type: Number },
    isPrimary: { type: Boolean },
})

const custUserModel = mongoose.model('cust_users', new Schema({
    phoneNo: { type: Number, required: true, minLength: 7, maxLength: 12, unique: true },
    status: { type: Boolean, default: true },
    userName: { type: String },
    emailId: { type: String },
    profileImage: { type: Boolean, default: false },
    name: { type: String },
    emergencyContacts: [],
    createdOn: { type: Date, default: Date.now },
    locations: [address]
}));

custUserModel.createIndexes({ phoneNo: 1, unique: true });

module.exports = custUserModel;

