// backend/routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const { createTeamMember, getAllTeamMembers, getTeamMemberById, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { protect, isAdmin } = require('../middleware/authMiddleware'); // Use isAdmin

router.route('/')
    .post(protect, isAdmin, createTeamMember) // No Multer needed here if frontend uploads image to Firebase
    .get(getAllTeamMembers);
router.route('/:id')
    .get(getTeamMemberById)
    .put(protect, isAdmin, updateTeamMember) // No Multer needed here
    .delete(protect, isAdmin, deleteTeamMember);

module.exports = router;