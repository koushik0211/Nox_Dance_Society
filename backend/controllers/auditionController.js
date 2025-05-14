// backend/controllers/auditionController.js
const Audition = require('../models/Audition');

// @desc    Register for an audition
// @route   POST /api/auditions/register
// @access  Public
const registerAudition = async (req, res) => {
    const {
        fullName,
        rollNumber,
        phoneNumber,
        emailAddress,
        preferredStyle,
        experienceYears,
        inspiration,
        favoriteMemory,
        songChoice
    } = req.body;

    try {
        // Check if roll number already exists
        const auditionExists = await Audition.findOne({ rollNumber });
        if (auditionExists) {
            return res.status(400).json({ message: 'Audition registration with this roll number already exists.' });
        }

        const newAudition = new Audition({
            fullName,
            rollNumber,
            phoneNumber,
            emailAddress,
            preferredStyle,
            experienceYears,
            inspiration,
            favoriteMemory,
            songChoice,
            danceVideoPath: req.file ? req.file.path : null // Save path if file was uploaded
        });

        const savedAudition = await newAudition.save();
        res.status(201).json({
            message: 'Audition registration successful!',
            audition: savedAudition
        });

    } catch (error) {
        console.error('Error during audition registration:', error);
        // Handle specific errors like validation errors if needed
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// @desc    Get all audition registrations (for admin later)
// @route   GET /api/auditions
// @access  Private/Admin
const getAllAuditions = async (req, res) => {
    try {
        const auditions = await Audition.find({});
        res.json(auditions);
    } catch (error) {
        console.error('Error fetching auditions:', error);
        res.status(500).json({ message: 'Server error fetching auditions.' });
    }
};


module.exports = {
    registerAudition,
    getAllAuditions,
};