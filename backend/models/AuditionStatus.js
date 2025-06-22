// backend/models/AuditionStatus.js
const mongoose = require('mongoose');

const auditionStatusSchema = new mongoose.Schema({
    // We can use a unique identifier to ensure we only have one status document
    identifier: {
        type: String,
        default: 'global_status',
        unique: true
    },
    areAuditionsOpen: {
        type: Boolean,
        required: true,
        default: false // Start with auditions closed by default
    },
    messageWhenClosed: {
        type: String,
        default: 'Auditions are currently closed. Follow our social media for announcements on the next season!'
    }
}, { timestamps: true });

module.exports = mongoose.model('AuditionStatus', auditionStatusSchema);