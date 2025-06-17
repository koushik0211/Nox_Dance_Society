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
    deleteAuditionEntry // <-- Import the new controller function
} = require('../controllers/auditionController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public route
router.post('/register', registerAudition);

// Admin routes
router.route('/')
    .get(protect, isAdmin, getAllAuditions);

router.route('/:id')
    .get(protect, isAdmin, getAuditionById)
    .delete(protect, isAdmin, deleteAuditionEntry); // <-- Use the controller function here

router.route('/:id/reviews')
    .post(protect, isAdmin, addAuditionReview);
    
router.route('/:id/reviews/:reviewId') // Corrected route for specificity
    .delete(protect, isAdmin, deleteAuditionReview);

router.route('/:id/status')
    .put(protect, isAdmin, updateAuditionStatus);

module.exports = router;