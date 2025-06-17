// backend/models/TeamMember.js
const mongoose = require('mongoose');
const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    year: { type: String, trim: true },
    position: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['Executive Board', 'Core Team', 'Members'] },
    imageUrl: { type: String, trim: true, default: '' }, // Will store Firebase URL
    instaUrl: { type: String, trim: true, lowercase: true, default: '' },
    linkedInUrl: { type: String, trim: true, lowercase: true, default: '' },
    intro: { type: String, trim: true, default: '' },
    specialization: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('TeamMember', teamMemberSchema);