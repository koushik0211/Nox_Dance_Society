// backend/models/Audition.js
const mongoose = require('mongoose');

const auditionSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true, unique: true }, // Assuming roll number is unique
    phoneNumber: { type: String, required: true, trim: true },
    emailAddress: { type: String, required: true, trim: true, lowercase: true },
    branch: { type: String, trim: true },
    rateYourself: { type: Number, min: 0,max:10 },
    whyNox: { type: String, trim: true },
    otherSkills: { type: String, trim: true },
    danceStyle: { type: String, trim: true },
    danceVideoUrl: { type: String, trim: true },
    status: {
        type: String,
        enum: ['Pending', 'Selected', 'Not Selected'],
        default: 'Pending'
    },
    reviews: [{ // Embed review IDs for easy retrieval
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }], 
    submissionDate: { type: Date, default: Date.now },
});

const Audition = mongoose.model('Audition', auditionSchema);

module.exports = Audition;