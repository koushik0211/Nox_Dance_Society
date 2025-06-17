// Nox2/frontend/src/components/TeamPage/TeamSection.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamMemberCard from './TeamMemberCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TeamSection = ({ title, members, sectionAnimationDelay }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [swipeDirection, setSwipeDirection] = useState(0);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sectionTitleVariants = {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, delay: sectionAnimationDelay || 0.1 } }
    };

    const desktopCardContainerVariants = {
        initial: {}, 
        animate: {
            transition: {
                staggerChildren: 0.08, 
                delayChildren: (sectionAnimationDelay || 0) + 0.15 
            }
        }
    };

    if (!members || members.length === 0) {
        return <p className="no-members-message">No members in this section yet.</p>;
    }

    const navigateCard = (direction) => {
        const newSwipeDirection = direction === 'next' ? 1 : -1;
        setSwipeDirection(newSwipeDirection);

        if (direction === 'next') {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % members.length);
        } else {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + members.length) % members.length);
        }
    };
    
    const mobileCardSwipeVariants = {
        enter: (direction) => ({ x: direction > 0 ? "90%" : "-90%", opacity: 0, scale: 0.9 }),
        center: { zIndex: 1, x: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
        exit: (direction) => ({ zIndex: 0, x: direction < 0 ? "90%" : "-90%", opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } })
    };

    return (
        <section className="team-page-section">
            <motion.h2 
                className="team-page-section__title"
                variants={sectionTitleVariants}
                initial="initial"
                whileInView="animate" 
                viewport={{ once: true, amount: 0.2 }} 
            >
                {title}
            </motion.h2>

            {isMobile ? (
                <div className="mobile-card-navigator">
                    <button 
                        onClick={() => navigateCard('prev')} 
                        className="mobile-nav-button prev" 
                        aria-label={`Previous member in ${title}`}
                        disabled={members.length <= 1}
                    >
                        <FaChevronLeft />
                    </button>
                    
                    <div className="mobile-card-display-area">
                        <AnimatePresence initial={false} custom={swipeDirection} mode="wait">
                            <motion.div
                                key={currentIndex} 
                                className="mobile-card-wrapper"
                                custom={swipeDirection} 
                                variants={mobileCardSwipeVariants}
                                initial="enter" 
                                animate="center" 
                                exit="exit"
                                drag="x" 
                                dragConstraints={{ left: 0, right: 0 }} 
                                dragElastic={0.6} 
                                onDragEnd={(event, { offset, velocity }) => {
                                    const swipePower = Math.abs(offset.x) * velocity.x;
                                    const swipeThreshold = 10000; 
                                    
                                    if (swipePower < -swipeThreshold) { 
                                        navigateCard('next');
                                    } else if (swipePower > swipeThreshold) { 
                                        navigateCard('prev');
                                    }
                                }}
                            >
                                <TeamMemberCard 
                                    member={members[currentIndex]} 
                                    // isCurrentlyExpanded is not needed if modals are independent
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button 
                        onClick={() => navigateCard('next')} 
                        className="mobile-nav-button next" 
                        aria-label={`Next member in ${title}`}
                        disabled={members.length <= 1}
                     >
                        <FaChevronRight />
                    </button>
                </div>
            ) : (
                <motion.div 
                    className="team-member-card-container" 
                    variants={desktopCardContainerVariants}
                    initial="initial" 
                    animate="animate" 
                >
                    {members.map((member) => (
                        <TeamMemberCard 
                            key={member.id} 
                            member={member}
                             // isCurrentlyExpanded is not needed if modals are independent
                        />
                    ))}
                </motion.div>
            )}
        </section>
    );
};

export default TeamSection;