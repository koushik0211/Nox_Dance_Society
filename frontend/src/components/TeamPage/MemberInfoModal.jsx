

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaTimes, FaUserTie, FaLightbulb } from 'react-icons/fa'; 
const MemberInfoModal = ({ isOpen, setIsOpen, member }) => {
    if (!member) return null; 

    const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } };
    const modalVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 250, delay: 0.1 } }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="member-info-modal-overlay" onClose={() => setIsOpen(false)}>
                <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <motion.div className="member-info-modal-backdrop" variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" />
                </Transition.Child>
                <div className="member-info-modal-scroll-container">
                    <div className="member-info-modal-center-content">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel as={motion.div} variants={modalVariants} initial="hidden" animate="visible" exit="hidden" className="member-info-modal-panel">
                                <div className="modal-header">
                                    <div className="modal-header-image-container">
                                        <img src={member.imageUrl || "/assets/team/member_placeholder.png"} alt={member.name} className="modal-member-image" />
                                    </div>
                                    <div className="modal-header-text">
                                        <Dialog.Title as="h3" className="member-info-modal__name">{member.name}</Dialog.Title>
                                        <p className="member-info-modal__position">{member.position} - {member.year}</p>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="member-info-modal__close-btn" aria-label="Close modal"> <FaTimes /> </button>
                                </div>
                                <div className="member-info-modal__body">
                                    {member.intro && ( <div className="modal-section"> <h4 className="modal-section__title"><FaUserTie /> About {member.name.split(' ')[0]}</h4> <p className="modal-section__text">{member.intro}</p> </div> )}
                                    {member.specialization && ( <div className="modal-section"> <h4 className="modal-section__title"><FaLightbulb /> Specializes In</h4> <p className="modal-section__text">{member.specialization}</p> </div> )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
export default MemberInfoModal;