// backend/controllers/tutorialController.js
const Tutorial = require('../models/Tutorial');

// @desc    Create a new tutorial
// @route   POST /api/tutorials
// @access  Private/Admin
exports.createTutorial = async (req, res) => {
    try {
        const newTutorial = new Tutorial({
            title: req.body.title,
            danceStyle: req.body.danceStyle,
            videoUrl: req.body.videoUrl, // URL from Firebase
            thumbnailUrl: req.body.thumbnailUrl, // URL from Firebase
            description: req.body.description,
            instructor: req.body.instructor,
            instructorInstaUrl: req.body.instructorInstaUrl,
            difficulty: req.body.difficulty,
            tags: req.body.tags,
            isPublished: req.body.isPublished,
            displayOrder: req.body.displayOrder,
        });
        const savedTutorial = await newTutorial.save();
        res.status(201).json(savedTutorial);
    } catch (error) {
        console.error("Error creating tutorial:", error);
        res.status(400).json({ message: "Error creating tutorial", error: error.message });
    }
};

// @desc    Get all tutorials, grouped by danceStyle
// @route   GET /api/tutorials
// @access  Public
exports.getAllTutorials = async (req, res) => {
    try {
        const tutorials = await Tutorial.find({ isPublished: true }).sort({ danceStyle: 1, displayOrder: 1, createdAt: -1 });
        
        // Group tutorials by dance style
        const groupedByStyle = tutorials.reduce((acc, tutorial) => {
            const style = tutorial.danceStyle;
            if (!acc[style]) {
                acc[style] = [];
            }
            acc[style].push(tutorial);
            return acc;
        }, {});

        res.json(groupedByStyle);
    } catch (error) {
        console.error("Error fetching tutorials:", error);
        res.status(500).json({ message: "Server Error fetching tutorials" });
    }
};

// @desc    Get tutorial by ID
// @route   GET /api/tutorials/:id
// @access  Public (or Private/Admin if for editing)
exports.getTutorialById = async (req, res) => {
    try {
        const tutorial = await Tutorial.findById(req.params.id);
        if (!tutorial) return res.status(404).json({ message: 'Tutorial not found' });
        res.json(tutorial);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update a tutorial
// @route   PUT /api/tutorials/:id
// @access  Private/Admin
exports.updateTutorial = async (req, res) => {
    try {
        const tutorial = await Tutorial.findById(req.params.id);
        if (!tutorial) return res.status(404).json({ message: 'Tutorial not found' });

        const { title, danceStyle, videoUrl, thumbnailUrl, description, instructor, instructorInstaUrl, difficulty, tags, isPublished, displayOrder } = req.body;
        
        // Optional: Delete old video/thumbnail from Firebase if URLs change
        
        tutorial.title = title || tutorial.title;
        tutorial.danceStyle = danceStyle || tutorial.danceStyle;
        tutorial.videoUrl = videoUrl !== undefined ? videoUrl : tutorial.videoUrl;
        tutorial.thumbnailUrl = thumbnailUrl !== undefined ? thumbnailUrl : tutorial.thumbnailUrl;
        tutorial.description = description || tutorial.description;
        tutorial.instructor = instructor || tutorial.instructor;
        tutorial.instructorInstaUrl = instructorInstaUrl !== undefined ? instructorInstaUrl : tutorial.instructorInstaUrl;
        tutorial.difficulty = difficulty || tutorial.difficulty;
        tutorial.tags = tags || tutorial.tags;
        tutorial.isPublished = isPublished !== undefined ? isPublished : tutorial.isPublished;
        tutorial.displayOrder = displayOrder !== undefined ? displayOrder : tutorial.displayOrder;

        const updatedTutorial = await tutorial.save();
        res.json(updatedTutorial);
    } catch (error) {
        console.error(`Error updating tutorial ${req.params.id}:`, error);
        res.status(400).json({ message: "Error updating tutorial", error: error.message });
    }
};

// @desc    Delete a tutorial
// @route   DELETE /api/tutorials/:id
// @access  Private/Admin
exports.deleteTutorial = async (req, res) => {
    try {
        const tutorial = await Tutorial.findById(req.params.id);
        if (!tutorial) return res.status(404).json({ message: 'Tutorial not found' });

        // Optional: Delete video/thumbnail from Firebase Storage
        
        await tutorial.deleteOne();
        res.json({ message: 'Tutorial removed' });
    } catch (error) {
        console.error(`Error deleting tutorial ${req.params.id}:`, error);
        res.status(500).json({ message: "Server Error deleting tutorial" });
    }
};