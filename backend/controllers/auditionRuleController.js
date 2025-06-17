// backend/controllers/auditionRuleController.js
const AuditionRule = require('../models/AuditionRule');

// Create, GetAll, GetByID, Update, Delete functions
// follow the SAME pattern.

exports.createRuleSet = async (req, res) => {
    try {
        const newRuleSet = new AuditionRule(req.body);
        const savedRuleSet = await newRuleSet.save();
        res.status(201).json(savedRuleSet);
    } catch (error) {
        res.status(400).json({ message: "Error creating rule set", error: error.message });
    }
};

// Get only the currently active rule set for public display
exports.getActiveRuleSet = async (req, res) => {
    try {
        const activeRuleSet = await AuditionRule.findOne({ isActive: true });
        // If no active set, maybe return an empty object or a default message
        if (!activeRuleSet) return res.json({ sectionTitle: "Rules To Be Announced", rules: [], eventDetails: {} });
        res.json(activeRuleSet);
    } catch (error) {
        res.status(500).json({ message: "Server Error fetching active rules" });
    }
};

// Get all rule sets for admin management
exports.getAllRuleSets = async (req, res) => {
    try {
        const ruleSets = await AuditionRule.find({}).sort({ createdAt: -1 });
        res.json(ruleSets);
    } catch (error) {
        res.status(500).json({ message: "Server Error fetching rule sets" });
    }
};

exports.getRuleSetById = async (req, res) => {
    try {
        const ruleSet = await AuditionRule.findById(req.params.id);
        if (!ruleSet) return res.status(404).json({ message: 'Rule set not found' });
        res.json(ruleSet);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Update a rule set. Includes logic to deactivate others if this one becomes active.
exports.updateRuleSet = async (req, res) => {
    try {
        // If this rule set is being set to active, deactivate all others
        if (req.body.isActive === true) {
            await AuditionRule.updateMany({ _id: { $ne: req.params.id } }, { $set: { isActive: false } });
        }
        req.body.lastUpdated = Date.now();
        const ruleSet = await AuditionRule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!ruleSet) return res.status(404).json({ message: 'Rule set not found' });
        res.json(ruleSet);
    } catch (error) {
        res.status(400).json({ message: "Error updating rule set", error: error.message });
    }
};

exports.deleteRuleSet = async (req, res) => {
    try {
        const ruleSet = await AuditionRule.findById(req.params.id);
        if (!ruleSet) return res.status(404).json({ message: 'Rule set not found' });
        await ruleSet.deleteOne();
        res.json({ message: 'Rule set removed' });
    } catch (error) {
        res.status(500).json({ message: "Server Error deleting rule set" });
    }
};