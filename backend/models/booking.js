const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
        required: true
    },
    seats: [{
        type: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "FAILED"],
        default: "PENDING"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
