// frontend/src/admin/components/ReviewComparisonModal.js
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaTimes, FaStar } from 'react-icons/fa';
import './AdminModals.css'; 

const ReviewComparisonModal = ({ isOpen, setIsOpen, reviews, candidateName }) => {
    const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const modalVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 250, delay: 0.1 } }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="admin-modal-overlay" onClose={() => setIsOpen(false)}>
                <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <motion.div className="admin-modal-backdrop" variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" />
                </Transition.Child>
                <div className="admin-modal-scroll-container">
                    <div className="admin-modal-center-content">
                        <Dialog.Panel as={motion.div} variants={modalVariants} initial="hidden" animate="visible" exit="hidden" className="admin-modal-panel large comparison-modal">
                            <Dialog.Title as="h3" className="admin-modal__title">
                                All Reviews for: {candidateName}
                            </Dialog.Title>
                            <button onClick={() => setIsOpen(false)} className="admin-modal__close-btn" aria-label="Close modal"><FaTimes /></button>

                            <div className="admin-modal__body">
                                <div className="review-comparison-grid">
                                    {reviews && reviews.length > 0 ? (
                                        reviews.map(review => (
                                            <div key={review._id} className="review-comparison-card">
                                                <h4 className="review-comparison-card__judge">
                                                    <span>{review.judgeEmail}</span>
                                                    {review.score && (
                                                        <span className="review-score">
                                                            <FaStar /> {review.score}/10
                                                        </span>
                                                    )}
                                                </h4>
                                                <p className="review-comparison-card__notes">{review.notes}</p>
                                            </div>
                                        ))
                                    ) : <p className="no-reviews-text">No reviews to compare.</p>}
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ReviewComparisonModal;