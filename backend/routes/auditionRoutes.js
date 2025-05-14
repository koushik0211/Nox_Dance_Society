// backend/routes/auditionRoutes.js
const express = require('express');
const router = express.Router();
const { registerAudition, getAllAuditions } = require('../controllers/auditionController');
const uploadAuditionVideo = require('../middleware/uploadMiddleware');
// const { protect, admin } = require('../middleware/authMiddleware'); // For protected routes later

// POST /api/auditions/register
// The uploadAuditionVideo middleware will handle the 'danceVideo' file upload first
router.post('/register', uploadAuditionVideo, registerAudition);

// GET /api/auditions (Example for admin, protect this later)
router.get('/', getAllAuditions); // Add 'protect, admin,' before getAllAuditions later

module.exports = router;