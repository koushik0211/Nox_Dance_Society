// backend/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    audition: { // Link to the specific audition entry
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Audition'
    },
    judge: { // Link to the user (judge) who wrote the review
        type: String, // Storing Firebase UID
        required: true
    },
    judgeEmail: { // Storing email for easy display
        type: String,
        required: true
    },
    notes: { // The actual review text
        type: String,
        required: true,
        trim: true
    },
    score: { // Optional: A numerical score
        type: Number,
        min: 1,
        max: 10
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);