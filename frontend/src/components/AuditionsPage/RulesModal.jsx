// src/components/AuditionsPage/RulesModal.js
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCalendarAlt, FaRegClock, FaMapMarkerAlt } from 'react-icons/fa';
import './RulesModal.css'; // Ensure this CSS file exists and is linked

const RulesModal = ({ isOpen, setIsOpen }) => {
    const rules = [ // Make sure this array is populated correctly
        "All participants must perform solo.",
        "Prepare a Choreography between 1 to 1.5 min.",
        "Judging will be based on technique, musicality and performance.",
        "Wear comfortable clothes and bring a water bottle.",
        "Feel free to choose any of your favorite songs to showcase your skills.",
        "Punctuality will be highly valued."
    ];

    const eventDetails = {
        date: "2nd September 2025", // Placeholder
        day: "Saturday",           // Placeholder
        venue: "TAN Audi (T-201)", // Placeholder
    };

    const backdropVariants = { /* ... same as before ... */ };
    const modalVariants = { /* ... same as before ... */ };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="rules-modal-overlay" onClose={() => setIsOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <motion.div
                        className="rules-modal-backdrop"
                        variants={backdropVariants} initial="hidden" animate="visible" exit="hidden"
                    />
                </Transition.Child>

                <div className="rules-modal-scroll-container">
                    <div className="rules-modal-center-content">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                as={motion.div}
                                variants={modalVariants} initial="hidden" animate="visible" exit="hidden"
                                className="rules-modal-panel"
                            >
                                <Dialog.Title
                                    as={motion.h3} className="rules-modal__title"
                                >
                                    RULES & REGULATIONS
                                </Dialog.Title>
                                <motion.div className="rules-modal__title-divider"></motion.div>

                                <motion.div className="rules-modal__content">
                                    <p className="rules-modal__intro-text">
                                        Welcome to NOX auditions! Please read the rules carefully before proceeding.
                                    </p>
                                    
                                    {/* THIS IS THE CRUCIAL PART FOR DISPLAYING RULES */}
                                    <h4 className="rules-modal__section-subtitle">General Rules:</h4>
                                    <ul className="rules-modal__list">
                                        {rules.map((rule, index) => (
                                             <motion.li
                                                key={index}
                                                className="rules-modal__list-item"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0, transition: { delay: 0.4 + index * 0.05 } }}
                                            >
                                                <FaCheckCircle className="rules-modal__list-item-icon" />
                                                <span>{rule}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    {/* END OF RULES LIST */}

                                    <motion.div className="rules-modal__details-box">
                                        <h4 className="rules-modal__details-title">Audition Details</h4>
                                        <div className="rules-modal__details-content">
                                            <p><FaCalendarAlt className="rules-modal__details-icon" /> <strong>Date:</strong>   {eventDetails.date}</p>
                                            <p><FaRegClock className="rules-modal__details-icon" /> <strong>Day:</strong>   {eventDetails.day}</p>
                                            <p><FaMapMarkerAlt className="rules-modal__details-icon" /> <strong>Venue:</strong>   {eventDetails.venue}</p>
                                        </div>
                                        <p className="rules-modal__note">Further details will be communicated to selected participants via Whatsapp.</p>
                                    </motion.div>
                                </motion.div>

                                <motion.div className="rules-modal__actions">
                                    <button
                                        type="button"
                                        className="rules-modal__close-button"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Got it, thanks!
                                    </button>
                                </motion.div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default RulesModal;