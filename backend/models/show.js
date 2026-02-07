const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre",
        required: true
    },
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    },
    showTime: {
        type: Date,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Show', showSchema);
