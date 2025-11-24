const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var carFeedback = new Schema({
    ac: { type: Number, default: 5 },
    cleaness: { type: Number, default: 5 },
    comfort: { type: Number, default: 5 },
    overAll: { type: Number, default: 5 }
})

var seating = new Schema({
    adult: { type: Number, required: true },
    child: { type: Number }
})

const carModel = mongoose.model('cars', new Schema({
    carNo: { type: String, unique: true, required: true },
    ownerName: { type: String, required: true },
    ownerPhoneNo: { type: Number, required: true },
    status: { type: Boolean, required: true, default: false },
    carModel: { type: String, required: true },
    carName: { type: String, required: true },
    carType: { type: String, required: true, enum: ['HATCHBACK', 'SEDAN', 'SUV', 'MUV', 'LUV'] },
    carSeating: { type: seating, required: true },
    carLuggage: { type: Number, required: true },
    createdOn: { type: Date, default: Date.now },
    carFeedbacks: { type: carFeedback, required: true },
    vendorRefPhoneNo: { type: Number, required: true },
}));

carModel.createIndexes({ carNo: 1, unique: true });

module.exports = carModel;