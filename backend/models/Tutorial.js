// backend/models/Tutorial.js
const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    danceStyle: { type: String, required: true, trim: true }, // e.g., "Breaking", "Locking"
    videoUrl: { type: String, required: true, trim: true }, // Firebase Storage download URL
    thumbnailUrl: { type: String, trim: true }, // Firebase Storage download URL
    description: { type: String, required: true, trim: true },
    instructor: { type: String, required: true, trim: true }, // Name of instructor
    instructorInstaUrl: { type: String, trim: true, lowercase: true, default: '' },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'All Levels',
    },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Tutorial', tutorialSchema);