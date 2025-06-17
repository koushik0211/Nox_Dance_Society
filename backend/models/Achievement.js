// backend/models/Achievement.js
const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    year: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    event: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: '' },
    imageUrl: { type: String, trim: true, default: '' }, // Firebase Storage download URL
    description: { type: String, required: true, trim: true },
    teamMemberIdsInvolved: [{ type: String }], // Array of IDs or names
    specialMentions: [{ type: String, trim: true }],
    displayDate: { type: Date, default: Date.now }, // For more precise sorting
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);