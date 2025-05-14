// Nox2/frontend/src/components/AchievementsPage/CompetitionTeamModal.js
// THIS FILE REMAINS THE SAME AS THE PREVIOUS "FINAL COMPLETE VERSION"
// (The one that correctly displays members and "View Profile" links)

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTimes, FaUsers, FaExternalLinkAlt } from 'react-icons/fa';

const CompetitionTeamModal = ({ isOpen, setIsOpen, achievementTitle, memberIds, currentTeamMembers }) => {
    const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const modalVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 250 } }
    };

    const currentTeamMap = currentTeamMembers.reduce((acc, member) => {
        acc[member.id] = member;
        return acc;
    }, {});

    const competitionTeamList = memberIds ? memberIds.map(id => {
        const member = currentTeamMap[id];
        // Attempt to find by name if ID match fails (more brittle)
        const memberByName = !member ? currentTeamMembers.find(m => m.name.toLowerCase() === id.toLowerCase()) : null;
        const finalMember = member || memberByName;

        return {
            id: finalMember ? finalMember.id : id, // Use actual ID if found, otherwise the provided ID/name
            name: finalMember ? finalMember.name : id, // Show name or the ID/name from achievement data
            isCurrent: !!finalMember,
            position: finalMember ? finalMember.position : null 
        };
    }).sort((a,b) => a.name.localeCompare(b.name)) : [];


    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="competition-team-modal-overlay" onClose={() => setIsOpen(false)}>
                <Transition.Child
                    as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <motion.div className="competition-team-modal-backdrop" variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" />
                </Transition.Child>

                <div className="competition-team-modal-scroll-container">
                    <div className="competition-team-modal-center-content">
                        <Transition.Child
                            as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as={motion.div} variants={modalVariants} initial="hidden" animate="visible" exit="hidden" className="competition-team-modal-panel">
                                <Dialog.Title as="h3" className="competition-team-modal__title">
                                    <FaUsers /> Team for "{achievementTitle}"
                                </Dialog.Title>
                                <button onClick={() => setIsOpen(false)} className="competition-team-modal__close-btn" aria-label="Close modal">
                                    <FaTimes />
                                </button>

                                <div className="competition-team-modal__list-container">
                                    {competitionTeamList.length > 0 ? (
                                        <ul className="competition-team-modal__list">
                                            {competitionTeamList.map((member) => (
                                                <li key={member.id || member.name} className="competition-team-modal__list-item"> {/* Use name as fallback key */}
                                                    <span className="member-name">{member.name}</span>
                                                    {member.position && <span className="member-position">({member.position})</span>}
                                                    {member.isCurrent && member.id && ( // Ensure member.id exists for link
                                                        <Link 
                                                            to={`/team#${member.id}`} 
                                                            className="view-profile-link"
                                                            title={`View ${member.name}'s current profile`}
                                                            onClick={() => setIsOpen(false)} 
                                                        >
                                                            View <FaExternalLinkAlt size="0.7em"/>
                                                        </Link>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="no-members-message">Team member details not available for this achievement.</p>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CompetitionTeamModal;