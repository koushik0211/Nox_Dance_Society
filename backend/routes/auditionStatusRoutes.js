// backend/routes/auditionStatusRoutes.js
const express = require('express');
const router = express.Router();
const { getStatus, updateStatus } = require('../controllers/auditionStatusController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public route for anyone to check the status
router.get('/', getStatus);

// Admin-only route to change the status
router.put('/', protect, isAdmin, updateStatus);

module.exports = router;