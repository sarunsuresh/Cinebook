const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    releaseStatus: {
        type: String,
        enum: ["Released", "Upcoming"],
        default: "Released"
    }
});

module.exports = mongoose.model("Movie", movieSchema);
