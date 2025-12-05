const mongoose = require('mongoose');

const vendorFeedbackSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor_user',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cust_users',
        required: true
    },
     bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicle_bookings',
        required: true
    },
    profileImgSrc: {
        type: String,
        default: '../../../../assets/customer_avatar.png'
    },
    reviewerName: {
        type: String,
        default: 'Anonymous',
    },
    starRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comments: {
        type: String,
        trim: true
    },
    scoredBadges: {
        type: [String]
    }
}, {
    timestamps: false
});
vendorFeedbackSchema.index({ vendorId: 1 });

const VendorFeedback = mongoose.model('vendor_feedback', vendorFeedbackSchema);

module.exports = VendorFeedback;