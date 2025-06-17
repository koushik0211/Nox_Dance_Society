// backend/routes/achievementRoutes.js
const express = require('express');
const router = express.Router();
const { createAchievement, getAllAchievements, getAchievementById, updateAchievement, deleteAchievement } = require('../controllers/achievementController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAllAchievements) // Public
    .post(protect, isAdmin, createAchievement); // Admin only

router.route('/:id')
    .get(getAchievementById) // Public
    .put(protect, isAdmin, updateAchievement) // Admin only
    .delete(protect, isAdmin, deleteAchievement); // Admin only

module.exports = router;