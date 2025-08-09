// frontend/src/admin/components/SchedulingModal.js
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaTimes, FaClock } from 'react-icons/fa';
import auditionService from '../services/auditionService';
import './AdminModals.css'; 

const SchedulingModal = ({ isOpen, setIsOpen, onScheduleSuccess }) => {
    const [startTime, setStartTime] = useState('16:00'); // Default to 4 PM
    const [endTime, setEndTime] = useState('20:00');   // Default to 8 PM
    const [slotDuration, setSlotDuration] = useState(30);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const response = await auditionService.scheduleSlots({ startTime, endTime, slotDuration });
            alert(response.data.message || "Scheduling successful!");
            onScheduleSuccess(); // This will trigger a refetch on the parent page
            setIsOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to schedule slots.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="admin-modal-overlay" onClose={() => setIsOpen(false)}>
                {/* ... Backdrop ... */}
                <div className="admin-modal-scroll-container">
                    <div className="admin-modal-center-content">
                        <Dialog.Panel as={motion.div} className="admin-modal-panel">
                            <Dialog.Title as="h3" className="admin-modal__title">
                                <FaClock /> Schedule Audition Time Slots
                            </Dialog.Title>
                            <button onClick={() => setIsOpen(false)} className="admin-modal__close-btn"><FaTimes /></button>

                            <div className="admin-modal__body">
                                <p className="modal-description">This will assign all 'Pending' auditions equally into time slots based on your inputs.</p>
                                {error && <p className="admin-error-message">{error}</p>}
                                <form onSubmit={handleSubmit} className="admin-form">
                                    <div className="form-grid">
                                        <div className="admin-form-group">
                                            <label htmlFor="startTime">Start Time (24h format)</label>
                                            <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                                        </div>
                                        <div className="admin-form-group">
                                            <label htmlFor="endTime">End Time (24h format)</label>
                                            <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                                        </div>
                                        <div className="admin-form-group full-span">
                                            <label htmlFor="slotDuration">Slot Duration (in minutes)</label>
                                            <input type="number" id="slotDuration" value={slotDuration} onChange={(e) => setSlotDuration(Number(e.target.value))} min="1" required />
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" onClick={() => setIsOpen(false)} className="cancel-button">Cancel</button>
                                        <button type="submit" className="admin-submit-button" disabled={isSubmitting}>
                                            {isSubmitting ? 'Scheduling...' : 'Divide into Slots'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default SchedulingModal;