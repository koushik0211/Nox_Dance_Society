// Nox2/frontend/src/components/AchievementsPage/AchievementCard.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMapMarkerAlt, FaUsers, FaPhotoVideo, FaInfoCircle, FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import CompetitionTeamModal from './CompetitionTeamModal'; 

const AchievementCard = ({ achievement, currentTeamMembers }) => {
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

    const cardVariants = {
        hidden: { opacity: 0, y: 60 }, 
        visible: { 
            opacity: 1, y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
        }
    };

    // Define hover variants for child elements
    const contentHoverVariants = {
        hover: { color: "#ffffff" }, // Example: Make title white on hover
        initial: { color: "#f3f4f6" } // Base color
    };
    const iconHoverVariants = {
        hover: { scale: 1.1, color: "#c084fc" },
        initial: { scale: 1, color: "#facc15" } // Base gold color
    };
    
    const MediaDisplay = ({ imageUrl, title }) => { // Simplified, only images
        if (imageUrl) {
            return <img src={imageUrl} alt={title} className="achievement-card-v4__image" />;
        }
        return <div className="achievement-card-v4__image-placeholder"><FaPhotoVideo/></div>; 
    };

    const hasTeamData = achievement.teamMemberIdsInvolved && achievement.teamMemberIdsInvolved.length > 0;

    return (
        <>
            <motion.div
                className="achievement-card-v4" // New class V4
                variants={cardVariants}
                initial="hidden"
                whileInView="visible" 
                viewport={{ once: true, amount: 0.1 }} 
                whileHover="hover" // Trigger hover state for child variants
                // No direct transform hover here, handled by CSS or child animations if needed
            >
                <div className="achievement-card-v4__image-container">
                    <MediaDisplay imageUrl={achievement.imageUrl} title={achievement.title}/>
                    <div className="achievement-card-v4__image-overlay"></div> 
                    {achievement.year && <div className="achievement-card-v4__year-badge">{achievement.year}</div>}
                </div>

                <div className="achievement-card-v4__content">
                    <motion.h3 
                        className="achievement-card-v4__title"
                        variants={contentHoverVariants} // Title color changes on card hover
                    >
                        <motion.span variants={iconHoverVariants} className="icon-wrapper"> 
                           <FaTrophy className="achievement-card-v4__title-icon" />
                        </motion.span>
                        {achievement.title}
                    </motion.h3>
                    
                    {/* Subtitle details */}
                    <div className="achievement-card-v4__meta-details">
                         <p className="achievement-card-v4__detail-item">
                            <FaMapMarkerAlt className="meta-icon" /> {achievement.event}
                         </p>
                         <p className="achievement-card-v4__detail-item">
                            <FaAward className="meta-icon" /> {achievement.category}
                         </p>
                    </div>

                    <p className="achievement-card-v4__description">{achievement.description}</p>
                    
                    {achievement.specialMentions && achievement.specialMentions.length > 0 && (
                        <div className="achievement-card-v4__special-mentions">
                             <FaInfoCircle/> Special Mentions: {achievement.specialMentions.join(' | ')}
                        </div>
                    )}

                    {hasTeamData && (
                        <div className="achievement-card-v4__actions">
                            <motion.button 
                                onClick={() => setIsTeamModalOpen(true)}
                                className="achievement-card-v4__view-team-button"
                                whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(168, 85, 247, 0.25)", borderColor: "rgba(168, 85, 247, 0.6)" }} 
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                               <FaUsers/> View Team
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>

            {hasTeamData && (
                <CompetitionTeamModal
                    isOpen={isTeamModalOpen}
                    setIsOpen={setIsTeamModalOpen}
                    achievementTitle={achievement.title}
                    memberIds={achievement.teamMemberIdsInvolved}
                    currentTeamMembers={currentTeamMembers}
                />
            )}
        </>
    );
};

export default AchievementCard;