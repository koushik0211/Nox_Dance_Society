// backend/routes/auditionRoutes.js
const express = require('express');
const router = express.Router();

const { 
    registerAudition, 
    getAllAuditions, 
    getAuditionById,
    addAuditionReview,
    updateAuditionStatus,
    deleteAuditionReview,
    deleteAuditionEntry,
    scheduleAuditionSlots,
    deleteNotSelected,
    exportAuditionsToCsv 
} = require('../controllers/auditionController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// === PUBLIC ROUTE ===
router.post('/register', registerAudition);


// === ADMIN PROTECTED ROUTES ===

// --- Main Audition List & Actions ---
// GET all entries
router.get('/', protect, isAdmin, getAllAuditions);

// POST action to schedule slots
router.post('/schedule-slots', protect, isAdmin, scheduleAuditionSlots);

// DELETE action for bulk-deleting 'Not Selected' entries
// THIS MUST BE DEFINED BEFORE the '/:id' route
router.delete('/not-selected', protect, isAdmin, deleteNotSelected);

// GET action to export auditions to CSV
router.get('/export', protect, isAdmin, exportAuditionsToCsv);


// --- Individual Audition Entry Actions ---
// These routes operate on a specific audition entry identified by :id
// Since '/:id' is generic, it comes AFTER more specific routes like '/not-selected'
router.route('/:id')
    .get(protect, isAdmin, getAuditionById)
    .delete(protect, isAdmin, deleteAuditionEntry);

// --- Review Actions ---
router.route('/:id/reviews')
    .post(protect, isAdmin, addAuditionReview);
    
router.route('/:id/reviews/:reviewId')
    .delete(protect, isAdmin, deleteAuditionReview);

// --- Status Update Action ---
router.route('/:id/status')
    .put(protect, isAdmin, updateAuditionStatus);


module.exports = router;