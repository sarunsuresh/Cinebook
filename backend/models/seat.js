const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
        required: true
    },

    seatNumber: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["AVAILABLE", "LOCKED", "BOOKED"],
        default: "AVAILABLE"
    },

    price: {
        type: Number,
        required: true
    },

    lockedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    lockedAt: {
        type: Date,
        default: null
    }
});


module.exports = mongoose.model('Seat', seatSchema);
