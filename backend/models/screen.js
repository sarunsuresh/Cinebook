const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre",
        required: true
    },
    screenName: {
        type: String,
        required: true
    },
    rows: {
        type: Number,
        required: true
    },
    columns: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Screen', screenSchema);
