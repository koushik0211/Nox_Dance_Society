// backend/models/AuditionRule.js
const mongoose = require('mongoose');

// Schema for a single rule within a section
const RuleSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 }
});

const auditionRuleSchema = new mongoose.Schema({
    sectionTitle: { type: String, required: true, trim: true, default: "General Rules" },
    rules: [RuleSchema], // Array of rule subdocuments
    eventDetails: { 
        date: { type: String, trim: true, default: '' },
        day: { type: String, trim: true, default: '' },
        venue: { type: String, trim: true, default: '' },
        time: { type: String, trim: true, default: '' },
    },
    isActive: { type: Boolean, default: false }, // Only one rule set should be active
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AuditionRule', auditionRuleSchema);