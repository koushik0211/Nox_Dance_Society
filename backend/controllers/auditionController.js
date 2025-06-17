// backend/controllers/auditionController.js
const Audition = require('../models/Audition');
const Review = require('../models/Review');
// @desc    Register for an audition
// @route   POST /api/auditions/register
// @access  Public
const registerAudition = async (req, res) => {
    const {
        fullName, rollNumber, phoneNumber, emailAddress,
        branch, rateYourself, whyNox,
        otherSkills, danceStyle,
        danceVideoUrl // Now expecting the URL from Firebase
    } = req.body;


    try {
        const auditionExists = await Audition.findOne({ rollNumber });
        if (auditionExists) {
            return res.status(400).json({ message: 'Audition with this roll number already exists.' });
        }

        const newAudition = new Audition({
            fullName, rollNumber, phoneNumber, emailAddress,
        branch, rateYourself, whyNox,
        otherSkills, danceStyle,
        danceVideoUrl // Use the URL passed from the frontend
        });

        const savedAudition = await newAudition.save();
        res.status(201).json({
            message: 'Audition registration successful!',
            audition: savedAudition
        });

    } catch (error) {
        console.error('Error during audition registration:', error);
        // Handle specific errors like validation errors if needed
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// @desc    Get all audition registrations (for admin later)
// @route   GET /api/auditions
// @access  Private/Admin
const getAllAuditions = async (req, res) => {
    try {
        // --- FIX IS HERE ---
        // Add .populate('reviews') to get the full review documents, not just their IDs.
        // Also adding a sort to keep the list consistent.
        const auditions = await Audition.find({}).sort({ submissionDate: -1 }).populate('reviews');
        
        res.json(auditions);
    } catch (error) {
        console.error('Error fetching auditions:', error);
        res.status(500).json({ message: 'Server error fetching auditions.' });
    }
};


// @desc    Get a single audition by ID, populating its reviews
// @route   GET /api/auditions/:id
// @access  Private/Admin
const getAuditionById = async (req, res) => {
    try {
        const audition = await Audition.findById(req.params.id).populate('reviews');
        if (!audition) return res.status(404).json({ message: 'Audition entry not found' });
        res.json(audition);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a review to an audition
// @route   POST /api/auditions/:id/reviews
// @access  Private/Admin
const addAuditionReview = async (req, res) => {
    // We now get judgeEmail (which holds the judge's name) from the REQUEST BODY
    const { notes, score, judgeEmail } = req.body; 
    const { id: auditionId } = req.params;
    const { uid: judgeFirebaseId } = req.user; // We can still log which admin account submitted it

    // --- VALIDATION ---
    if (!notes || !judgeEmail) {
        return res.status(400).json({ message: 'Review notes and judge name are required.' });
    }

    try {
        const audition = await Audition.findById(auditionId);
        if (!audition) return res.status(404).json({ message: 'Audition not found' });
        
        // --- THIS IS THE KEY FIX ---
        // Check if a review from this specific JUDGE NAME already exists for this audition.
        // We will query the Review collection directly.
        const existingReview = await Review.findOne({ 
            audition: auditionId, 
            judgeEmail: { $regex: new RegExp(`^${judgeEmail}$`, 'i') } // Case-insensitive check
        });

        if(existingReview) {
            return res.status(400).json({ message: `A review from judge '${judgeEmail}' already exists for this candidate.` });
        }

        const review = new Review({
            notes,
            score: score || null, // Handle optional score
            audition: auditionId,
            judge: judgeFirebaseId, // Log which admin account created it
            judgeEmail: judgeEmail  // THIS IS THE DISPLAY NAME FOR THE JUDGE
        });
        const savedReview = await review.save();
        
        audition.reviews.push(savedReview._id);
        await audition.save();

        // Populate the new review with author info before sending back
        const populatedReview = await Review.findById(savedReview._id);

        res.status(201).json({ message: 'Review added successfully', review: populatedReview });

    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: 'Server Error adding review' });
    }
};


// @desc    Update an audition's status
// @route   PUT /api/auditions/:id/status
// @access  Private/Admin
const updateAuditionStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const audition = await Audition.findById(req.params.id);
        if (!audition) return res.status(404).json({ message: 'Audition not found' });

        if (!['Pending', 'Selected', 'Not Selected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        audition.status = status;
        const updatedAudition = await audition.save();
        res.json(updatedAudition);
    } catch (error) {
        res.status(400).json({ message: 'Error updating status', error: error.message });
    }
};

const deleteAuditionReview = async (req, res) => {
    const { auditionId, reviewId } = req.params;

    try {
        // Find the review to make sure it exists
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // Optional: Check if the person deleting is the one who created it or a super-admin
        // For now, we assume any logged-in admin can delete any review.

        // Remove the review reference from the Audition document
        await Audition.findByIdAndUpdate(auditionId, {
            $pull: { reviews: reviewId }
        });

        // Delete the review document itself
        await review.deleteOne();

        res.json({ message: 'Review deleted successfully.' });

    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: 'Server Error deleting review.' });
    }
};

const deleteAuditionEntry = async (req, res) => {
    try {
        const audition = await Audition.findById(req.params.id);
        if (!audition) {
            return res.status(404).json({ message: 'Audition entry not found' });
        }

        // Also delete all associated reviews from the Review collection
        await Review.deleteMany({ audition: audition._id });

        // Then delete the audition entry itself
        await audition.deleteOne();

        res.json({ message: 'Audition entry and all associated reviews deleted.' });
    } catch (error) {
        console.error("Error deleting audition entry:", error);
        res.status(500).json({ message: 'Server Error deleting entry.' });
    }
};



module.exports = {
    registerAudition,
    getAllAuditions,
    getAuditionById,
    addAuditionReview,
    updateAuditionStatus,
    deleteAuditionReview,
    deleteAuditionEntry 
};