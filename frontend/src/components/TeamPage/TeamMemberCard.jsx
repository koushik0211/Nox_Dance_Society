import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaChevronDown, FaChevronUp, FaUserAlt } from 'react-icons/fa';

const TeamMemberCard = ({ member }) => { // Removed animationDelay if relying on parent stagger
    const [isExpanded, setIsExpanded] = useState(false);

    const cardVariants = { // Variants for when parent staggers
        initial: { opacity: 0, y: 60, filter: 'blur(3px)' },
        animate: {
            opacity: 1, y: 0, filter: 'blur(0px)',
            transition: { type: "spring", stiffness: 70, damping: 18 } // Removed direct delay
        }
    };

    const AnimateHeightWrapper = ({ children, isVisible }) => {
        return (
            <motion.div
                initial={false} 
                animate={{ 
                    height: isVisible ? 'auto' : 0,
                    opacity: isVisible ? 1 : 0,
                    marginTop: isVisible ? '0.75rem' : '0rem', 
                    marginBottom: isVisible ? '0.75rem' : '0rem'
                }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                style={{ overflow: 'hidden' }} 
            >
                {children}
            </motion.div>
        );
    };

    return (
        <motion.div
            className="team-member-card-v2"
            variants={cardVariants}
            // Removed initial and animate, as they will be controlled by parent stagger
            whileHover={{ 
                y: -7,          
                scale: 1.02,    
            }}
            transition={{ type: "spring", stiffness: 250, damping: 18 }}
        >
            <div className="team-member-card-v2__header">
                <div className="team-member-card-v2__image-container">
                    {member.imageUrl && member.imageUrl !== "/assets/team/member_placeholder.png" ? (
                        <img src={member.imageUrl} alt={member.name} className="team-member-card-v2__image" />
                    ) : (
                        <div className="team-member-card-v2__image-placeholder">
                            <FaUserAlt />
                        </div>
                    )}
                    <div className="team-member-card-v2__image-glow"></div> 
                </div>
                <div className="team-member-card-v2__name-title">
                    <h3 className="team-member-card-v2__name">{member.name}</h3>
                    <p className="team-member-card-v2__position">{member.position}</p>
                </div>
            </div>

            <div className="team-member-card-v2__body">
                <p className="team-member-card-v2__year">{member.year}</p>
                
                <AnimateHeightWrapper isVisible={isExpanded}>
                    <div className="team-member-card-v2__details-content">
                        <p className="team-member-card-v2__intro">{member.intro}</p>
                        <p className="team-member-card-v2__specialization">
                            <strong>Specializes in:</strong> {member.specialization}
                        </p>
                    </div>
                </AnimateHeightWrapper>

                {member.intro && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="team-member-card-v2__expand-toggle"
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />} Read {isExpanded ? 'Less' : 'More'}
                    </button>
                )}
            </div>
            
            <div className="team-member-card-v2__footer">
                <div className="team-member-card-v2__socials">
                    {member.instaUrl && member.instaUrl !== "#" && (
                        <a href={member.instaUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Instagram`} className="social-icon-link">
                            <FaInstagram />
                        </a>
                    )}
                    {member.linkedInUrl && member.linkedInUrl !== "#" &&(
                        <a href={member.linkedInUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`} className="social-icon-link">
                            <FaLinkedin />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default TeamMemberCard;