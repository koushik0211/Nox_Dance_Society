// backend/controllers/teamController.js
const TeamMember = require('../models/TeamMember');
// const admin = require('../config/firebaseAdmin'); // Needed if you interact with storage from backend

// @desc    Create a new team member
// @route   POST /api/team
// @access  Private/Admin (secured by protect, isAdmin middleware in routes)
const createTeamMember = async (req, res) => {
    // imageUrl is now expected to be a URL from Firebase Storage, sent by admin frontend
    const { name, year, position, category, instaUrl, linkedInUrl, intro, specialization, imageUrl } = req.body;
    
    try {
        const newMember = new TeamMember({
            name, year, position, category, instaUrl, linkedInUrl, intro, specialization, imageUrl
        });
        const savedMember = await newMember.save();
        res.status(201).json(savedMember);
    } catch (error) {
        console.error("Error creating team member:", error);
        res.status(400).json({ message: "Error creating team member", error: error.message });
    }
};

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getAllTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.find({}).sort({ category: 1, displayOrder: 1, name: 1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get team member by ID
// @route   GET /api/team/:id
// @access  Public
const getTeamMemberById = async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (member) {
            res.json(member);
        } else {
            res.status(404).json({ message: 'Team member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private/Admin
const updateTeamMember = async (req, res) => {
    const { name, year, position, category, instaUrl, linkedInUrl, intro, specialization, imageUrl, isActive, displayOrder } = req.body;
    try {
        const member = await TeamMember.findById(req.params.id);
        if (member) {
            member.name = name || member.name;
            member.year = year || member.year;
            member.position = position || member.position;
            member.category = category || member.category;
            member.instaUrl = instaUrl; // Allow empty/null
            member.linkedInUrl = linkedInUrl; // Allow empty/null
            member.intro = intro || member.intro;
            member.specialization = specialization || member.specialization;
            member.imageUrl = imageUrl !== undefined ? imageUrl : member.imageUrl; // Update if provided
            member.isActive = isActive !== undefined ? isActive : member.isActive;
            member.displayOrder = displayOrder !== undefined ? displayOrder : member.displayOrder;

            const updatedMember = await member.save();
            res.json(updatedMember);
        } else {
            res.status(404).json({ message: 'Team member not found' });
        }
    } catch (error) {
        console.error("Error updating team member:", error);
        res.status(400).json({ message: "Error updating team member", error: error.message });
    }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
const deleteTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (member) {
            // Optional: Delete image from Firebase Storage if imageUrl is stored
            // if (member.imageUrl) {
            //     const path = getPathFromUrl(member.imageUrl); // Helper function to extract path
            //     if (path) await admin.storage().bucket().file(path).delete().catch(e => console.error("FB Storage delete error:", e));
            // }
            await member.deleteOne(); // Mongoose v6+
            res.json({ message: 'Team member removed' });
        } else {
            res.status(404).json({ message: 'Team member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createTeamMember, getAllTeamMembers, getTeamMemberById, updateTeamMember, deleteTeamMember };