const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleFeedback = new Schema({
    ac: { type: Number, default: 5 },
    cleaness: { type: Number, default: 5 },
    comfort: { type: Number, default: 5 },
    overAll: { type: Number, default: 5 }
})

const seating = new Schema({
    adult: { type: Number, required: true },
    child: { type: Number }
})

const vehicleModel = mongoose.model('vehicle', new Schema({
    vehicleNo: { type: String, unique: true, required: true },
    status: { type: Boolean, required: true, default: false },
    vehicleModel: { type: String, required: true },
    vehicleName: { type: String, required: true },
    vehicleType: { type: String, required: true, enum: ['HATCHBACK', 'SEDAN', 'SUV', 'MUV', 'LUV'] },
    vehicleSeating: { type: seating, required: true },
    vehicleLuggage: { type: Number, required: true },
    createdOn: { type: Date, default: Date.now },
    vehicleFeedbacks: { type: vehicleFeedback, default: {} },
    vendorRefPhoneNo: { type: Schema.Types.ObjectId, ref: 'vendor_users', required: true }
}));

vehicleModel.createIndexes({ vehicleNo: 1, unique: true });

module.exports = vehicleModel;