// backend/routes/auditionRuleRoutes.js
const express = require('express');
const router = express.Router();
const { createRuleSet, getActiveRuleSet, getAllRuleSets, getRuleSetById, updateRuleSet, deleteRuleSet } = require('../controllers/auditionRuleController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public route to get the currently active rules for the main website
router.get('/active', getActiveRuleSet); 

// Admin routes to manage all rule sets
router.route('/')
    .get(protect, isAdmin, getAllRuleSets) // Get all for admin view
    .post(protect, isAdmin, createRuleSet);

router.route('/:id')
    .get(protect, isAdmin, getRuleSetById)
    .put(protect, isAdmin, updateRuleSet)
    .delete(protect, isAdmin, deleteRuleSet);

module.exports = router;