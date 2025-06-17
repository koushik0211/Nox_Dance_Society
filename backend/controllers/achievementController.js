// backend/controllers/achievementController.js
const Achievement = require('../models/Achievement');

// Create, GetAll, GetByID, Update, Delete functions
// follow the SAME pattern as tutorialController.js, but using the Achievement model.

exports.createAchievement = async (req, res) => {
    try {
        const newAchievement = new Achievement(req.body); // Assumes body matches model
        const savedAchievement = await newAchievement.save();
        res.status(201).json(savedAchievement);
    } catch (error) {
        res.status(400).json({ message: "Error creating achievement", error: error.message });
    }
};

exports.getAllAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find({}).sort({ year: -1, displayDate: -1 });
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: "Server Error fetching achievements" });
    }
};

exports.getAchievementById = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
        res.json(achievement);
    } catch (error) {
        res.status(400).json({ message: "Error updating achievement", error: error.message });
    }
};

exports.deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
        await achievement.deleteOne();
        res.json({ message: 'Achievement removed' });
    } catch (error) {
        res.status(500).json({ message: "Server Error deleting achievement" });
    }
};