
// frontend/src/admin/components/AuditionDetailModal.js
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaTimes, FaUser, FaVideo, FaStickyNote, FaCheck, FaStar, FaTrash } from 'react-icons/fa';
import auditionService from '../services/auditionService';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import './AdminModals.css'; 
import ReviewComparisonModal from './ReviewComparisonModal';

const AuditionDetailModal = ({ isOpen, setIsOpen, audition, onUpdate, judgeName }) => {
    const [reviewNotes, setReviewNotes] = useState('');
    const [reviewScore, setReviewScore] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const { getIdToken } = useAuth();
    const isMobile = useIsMobile();

    // This is a crucial safeguard. If the modal is told to be open but has no audition data,
    // it should not attempt to render.
    if (!audition) return null;

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!judgeName.trim()) {
            alert("Please set your Judge Name at the top of the page to submit a review.");
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const reviewData = { notes: reviewNotes, judgeEmail: judgeName, score: reviewScore ? Number(reviewScore) : undefined };
            await auditionService.addReview(audition._id, reviewData, getIdToken);
            setReviewNotes('');
            setReviewScore('');
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit review.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleStatusChange = async (newStatus) => {
        // if (window.confirm(`Are you sure you want to mark this candidate as "${newStatus}"?`)) {
            try {
                await auditionService.updateStatus(audition._id, { status: newStatus }, getIdToken);
                onUpdate();
            } catch (err) {
                alert("Failed to update status.");
            }
        
    };

    const handleDeleteReview = async (reviewId) => {
        // if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await auditionService.removeReview(audition._id, reviewId, getIdToken);
                alert("Review deleted.");
                onUpdate();
            } catch (err) {
                alert(`Error: ${err.response?.data?.message || "Failed to delete review."}`);
            
        }
    };
    
    const hasUserReviewed = audition.reviews.some(review => 
        review.judgeEmail && review.judgeEmail.toLowerCase() === judgeName.toLowerCase()
    );

    const modalVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 250, delay: 0.1 } }
    };

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="admin-modal-overlay" onClose={() => setIsOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <motion.div className="admin-modal-backdrop" />
                    </Transition.Child>
                    <div className="admin-modal-scroll-container">
                        <div className="admin-modal-center-content">
                            <Dialog.Panel as={motion.div} variants={modalVariants} initial="hidden" animate="visible" exit="hidden" className={`admin-modal-panel ${!isMobile ? 'large' : ''}`}>
                                <Dialog.Title as="h3" className="admin-modal__title">
                                    Details: {audition.fullName}
                                </Dialog.Title>
                                <button onClick={() => setIsOpen(false)} className="admin-modal__close-btn"><FaTimes /></button>

                                <div className={`admin-modal__body ${!isMobile ? 'two-column' : ''}`}>
                                    {/* Column 1: Applicant Details (Always visible) */}
                                    <div className="modal-column">
                                        <h4><FaUser /> Applicant Info</h4>
                                        <p><strong>Full Name:</strong> {audition.fullName}</p>
                                        <p><strong>Phone:</strong> {audition.phoneNumber}</p>
                                        <p><strong>Roll no.</strong> {audition.rollNumber}</p>
                                        <p><strong>Email:</strong> {audition.emailAddress}</p>
                                        <p><strong>Branch:</strong> {audition.branch || 'N/A'}</p> 
                                        <p><strong>Dance Style:</strong> {audition.danceStyle}</p>
                                        <p><strong>Rating:</strong> {audition.rateYourself}/10</p>
                                        <p><strong>Why Nox:</strong> {audition.whyNox || 'N/A'}</p> 
                                        <p><strong>Other Skills:</strong> {audition.otherSkills || 'N/A'}</p>
                                        
                                        {audition.danceVideoUrl ? (
                                            <a href={audition.danceVideoUrl} target="_blank" rel="noopener noreferrer" className="video-link-button">
                                                <FaVideo/> Watch Audition Video
                                            </a>
                                        ) : (
                                            <p className="no-video-link">No video link submitted.</p>
                                        )}
                                        <div className="status-updater">
                                            <strong>Status: </strong>
                                            <button onClick={() => handleStatusChange('Selected')} className="status-btn selected"><FaCheck/> Select</button>
                                            <button onClick={() => handleStatusChange('Not Selected')} className="status-btn not-selected"><FaTimes/> Reject</button>
                                            <button onClick={() => handleStatusChange('Pending')} className="status-btn pending">Reset</button>
                                        </div>
                                    </div>
                                    
                                    {/* Column 2: Reviews - RENDERED ONLY ON DESKTOP */}
                                    {!isMobile && (
                                        <div className="modal-column">
                                            <h4><FaStickyNote /> Judge Reviews</h4>
                                            <button 
                                                onClick={() => { setIsOpen(false); setIsCompareModalOpen(true); }}
                                                className="compare-reviews-button"
                                                disabled={!audition.reviews || audition.reviews.length === 0}
                                            >
                                                Compare All Reviews ({audition.reviews.length})
                                            </button>
                                            
                                            <div className="reviews-list">
                                                {audition.reviews && audition.reviews.length > 0 ? (
                                                    audition.reviews.map(review => (
                                                        <div key={review._id} className="review-item">
                                                            <div className="review-item-header">
                                                                <p className="review-author">{review.judgeEmail}</p>
                                                                {review.score && (<span className="review-score"><FaStar /> {review.score}/10</span>)}
                                                                <button onClick={() => handleDeleteReview(review._id)} className="delete-review-button" title="Delete this review"><FaTrash /></button>
                                                            </div>
                                                            <p className="review-notes">"{review.notes}"</p>
                                                        </div>
                                                    ))
                                                ) : <p className="no-reviews-text">No reviews yet.</p>}
                                            </div>
                                            
                                            {!hasUserReviewed && judgeName ? (
                                                <form onSubmit={handleReviewSubmit} className="review-form">
                                                    <h4>Add Your Review (as {judgeName})</h4>
                                                    {error && <p className="admin-error-message small">{error}</p>}
                                                    <textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} placeholder="Notes..." required></textarea>
                                                    <input type="number" value={reviewScore} onChange={(e) => setReviewScore(e.target.value)} min="1" max="10" placeholder="Score (1-10, optional)" />
                                                    <button type="submit" className="admin-submit-button small" disabled={isSubmitting}>
                                                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                                    </button>
                                                </form>
                                            ) : (
                                                <div className="review-placeholder">
                                                    {hasUserReviewed ? "Your review as this judge has been submitted." : "Enter a Judge Name to add a review."}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            
            <ReviewComparisonModal 
                isOpen={isCompareModalOpen}
                setIsOpen={setIsCompareModalOpen}
                reviews={audition.reviews}
                // --- THIS IS THE FIX ---
                // Use the 'audition' prop that the component received, not 'selectedAudition'
                candidateName={audition?.fullName || ''} 
            />
        </>
    );
};

export default AuditionDetailModal;