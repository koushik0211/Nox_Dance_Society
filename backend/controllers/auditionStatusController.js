// backend/controllers/auditionStatusController.js
const AuditionStatus = require('../models/AuditionStatus');

// This function gets the current status. If it doesn't exist, it creates one.
const getStatus = async (req, res) => {
    try {
        let status = await AuditionStatus.findOne({ identifier: 'global_status' });
        if (!status) {
            // If no status doc exists, create one with default (closed)
            status = await AuditionStatus.create({ areAuditionsOpen: false });
        }
        res.json(status);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching status' });
    }
};

// This function toggles the status.
const updateStatus = async (req, res) => {
    try {
        const { areAuditionsOpen, messageWhenClosed } = req.body;
        
        let status = await AuditionStatus.findOneAndUpdate(
            { identifier: 'global_status' },
            { 
                areAuditionsOpen: areAuditionsOpen, 
                messageWhenClosed: messageWhenClosed 
            },
            { new: true, upsert: true } // upsert: true creates the doc if it doesn't exist
        );
        res.json(status);
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(400).json({ message: 'Error updating status', error: error.message });
    }
};

module.exports = { getStatus, updateStatus };