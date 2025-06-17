// backend/routes/tutorialRoutes.js
const express = require('express');
const router = express.Router();
const { createTutorial, getAllTutorials, getTutorialById, updateTutorial, deleteTutorial } = require('../controllers/tutorialController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAllTutorials) // Public
    .post(protect, isAdmin, createTutorial); // Admin only

router.route('/:id')
    .get(getTutorialById) // Public
    .put(protect, isAdmin, updateTutorial) // Admin only
    .delete(protect, isAdmin, deleteTutorial); // Admin only

module.exports = router;