// backend/models/Audition.js
const mongoose = require('mongoose');

const auditionSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true, unique: true }, // Assuming roll number is unique
    phoneNumber: { type: String, required: true, trim: true },
    emailAddress: { type: String, required: true, trim: true, lowercase: true },
    preferredStyle: { type: String, trim: true },
    experienceYears: { type: Number, min: 0 },
    inspiration: { type: String, trim: true },
    favoriteMemory: { type: String, trim: true },
    songChoice: { type: String, trim: true },
    danceVideoPath: { type: String }, // Path where the video is stored (if uploaded)
    submissionDate: { type: Date, default: Date.now },
});

const Audition = mongoose.model('Audition', auditionSchema);

module.exports = Audition;