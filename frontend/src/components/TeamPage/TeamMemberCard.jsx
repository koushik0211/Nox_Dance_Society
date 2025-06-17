import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaUserAlt, FaExternalLinkAlt } from 'react-icons/fa';
import MemberInfoModal from './MemberInfoModal';

const TeamMemberCard = ({ member }) => { 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const cardVariants = {
        initial: { opacity: 0, y: 50, filter: 'blur(2px)' },
        animate: {
            opacity: 1, y: 0, filter: 'blur(0px)',
            transition: { type: "spring", stiffness: 75, damping: 20 } // Adjusted damping
        }
    };

    return (
        <>
            <motion.div
                className="team-member-card-v3"
                variants={cardVariants}
                // initial="initial" // Handled by parent (TeamSection) stagger
                // animate="animate" 
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
            >
                <div className="team-member-card-v3__image-section">
                    {member.imageUrl && member.imageUrl !== "/assets/team/member_placeholder.png" ? (
                        <img src={member.imageUrl} alt={member.name} className="team-member-card-v3__image" />
                    ) : (
                        <div className="team-member-card-v3__image-placeholder"><FaUserAlt /></div>
                    )}
                    <div className="team-member-card-v3__image-overlay-gradient"></div>
                    <div className="team-member-card-v3__year-badge">{member.year}</div>
                </div>

                <div className="team-member-card-v3__info-section">
                    <h3 className="team-member-card-v3__name">{member.name}</h3>
                    <p className="team-member-card-v3__position">{member.position}</p>
                    
                    <div className="team-member-card-v3__socials">
                        {member.instaUrl && member.instaUrl !== "#" && (
                            <a href={member.instaUrl} target="_blank" rel="noopener noreferrer" className="social-icon-link-v3" aria-label={`${member.name}'s Instagram`}>
                                <FaInstagram />
                            </a>
                        )}
                        {member.linkedInUrl && member.linkedInUrl !== "#" && (
                            <a href={member.linkedInUrl} target="_blank" rel="noopener noreferrer" className="social-icon-link-v3" aria-label={`${member.name}'s LinkedIn`}>
                                <FaLinkedin />
                            </a>
                        )}
                    </div>

                    {member.intro && (
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="team-member-card-v3__readmore-button"
                        >
                            Read More <FaExternalLinkAlt size="0.7em" style={{marginLeft: '5px'}} />
                        </button>
                    )}
                </div>
            </motion.div>

            <MemberInfoModal 
                isOpen={isModalOpen} 
                setIsOpen={setIsModalOpen} 
                member={member} 
            />
        </>
    );
};

export default TeamMemberCard;