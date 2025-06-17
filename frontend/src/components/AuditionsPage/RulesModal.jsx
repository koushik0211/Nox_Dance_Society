// frontend/src/components/AuditionsPage/RulesModal.js
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCalendarAlt, FaRegClock, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import './RulesModal.css';

const RulesModal = ({ isOpen, setIsOpen, rulesData }) => {
    // If there's no data yet (e.g., during initial load), render a loader or a minimal modal
    if (!rulesData) {
        return (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="rules-modal-overlay" onClose={() => setIsOpen(false)}>
                    <div className="rules-modal-scroll-container">
                        <div className="rules-modal-center-content">
                            <Dialog.Panel className="rules-modal-panel">
                                <FaSpinner className="loading-spinner" /> Loading rules...
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    }

    // Destructure the data from the prop with default values for safety
    const { sectionTitle = "Rules & Regulations", rules = [], eventDetails = {} } = rulesData;

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.90, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25, duration: 0.4, delay: 0.1 } }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="rules-modal-overlay" onClose={() => setIsOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
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
                                    initial={{opacity:0, y: -10}} animate={{opacity:1, y:0, transition:{delay:0.2}}}
                                >
                                    {sectionTitle}
                                </Dialog.Title>
                                <motion.div className="rules-modal__title-divider"
                                    initial={{scaleX:0}} animate={{scaleX:1, transition:{delay:0.25, duration:0.4}}}
                                ></motion.div>

                                <motion.div className="rules-modal__content-wrapper" initial={{opacity:0}} animate={{opacity:1, transition:{delay:0.3}}}>
                                    <ul className="rules-modal__list">
                                        {rules.map((rule, index) => (
                                             <motion.li
                                                key={rule._id || index} // Use MongoDB _id if available, else index
                                                className="rules-modal__list-item"
                                                initial={{ opacity: 0, x: -15 }}
                                                animate={{ opacity: 1, x: 0, transition: { delay: 0.35 + index * 0.06, type:"spring", stiffness:120 } }}
                                            >
                                                <FaCheckCircle className="rules-modal__list-item-icon" />
                                                <span>{rule.text}</span>
                                            </motion.li>
                                        ))}
                                    </ul>

                                    <motion.div className="rules-modal__details-box"
                                        initial={{opacity:0, y:10}} animate={{opacity:1, y:0, transition:{delay:0.5, duration:0.3}}}
                                    >
                                        <h4 className="rules-modal__details-title">Audition Details</h4>
                                        <div className="rules-modal__details-content">
                                            {eventDetails.date && <p><FaCalendarAlt className="rules-modal__details-icon" /> <strong>Date:</strong>   {eventDetails.date}</p>}
                                            {eventDetails.day && <p><FaRegClock className="rules-modal__details-icon" /> <strong>Day:</strong>   {eventDetails.day}</p>}
                                            {eventDetails.venue && <p><FaMapMarkerAlt className="rules-modal__details-icon" /> <strong>Venue:</strong>   {eventDetails.venue}</p>}
                                            {eventDetails.time && <p><FaRegClock className="rules-modal__details-icon" /> <strong>Time:</strong>   {eventDetails.time}</p>}
                                        </div>
                                        <p className="rules-modal__note">Further details will be communicated to selected participants.</p>
                                    </motion.div>
                                </motion.div>

                                <motion.div className="rules-modal__actions" initial={{opacity:0}} animate={{opacity:1, transition:{delay:0.6}}}>
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