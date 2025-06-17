// src/components/LearnPage/LearnStyleSectionHorizontal.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TutorialCard from './TutorialCard'; // Assuming TutorialCard.js is in the same folder or adjust path
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// Import LearnPage.css or ensure relevant styles are global or passed down if this component has unique styles

const LearnStyleSectionHorizontal = ({ styleName, tutorials, sectionTitleVariants: propSectionTitleVariants }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [swipeDirection, setSwipeDirection] = useState(0);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!tutorials || tutorials.length === 0) {
        return <p className="no-tutorials-message">No tutorials for {styleName} yet.</p>;
    }

    const navigateCard = (direction) => {
        const newDirection = direction === 'next' ? 1 : -1;
        setSwipeDirection(newDirection);
        if (direction === 'next') {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % tutorials.length);
        } else {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + tutorials.length) % tutorials.length);
        }
    };

    const cardSwipeVariants = {
        enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0, scale: 0.9 }),
        center: { zIndex: 1, x: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
        exit: (direction) => ({ zIndex: 0, x: direction < 0 ? "100%" : "-100%", opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } })
    };
    
    // Use passed variants or default if not provided
    const sectionTitleVariants = propSectionTitleVariants || {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, delay: 0.1 }}
    };


    return (
        <section className="learn-style-section">
            <motion.h2 
                className="learn-style-section__title"
                variants={sectionTitleVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
            >
                {styleName}
            </motion.h2>

            {isMobile ? (
                <div className="mobile-card-navigator">
                    <button onClick={() => navigateCard('prev')} className="mobile-nav-button prev" aria-label="Previous tutorial" disabled={tutorials.length <= 1}>
                        <FaChevronLeft />
                    </button>
                    <div className="mobile-card-display-area">
                        <AnimatePresence initial={false} custom={swipeDirection}>
                            <motion.div
                                key={currentIndex}
                                className="mobile-card-wrapper"
                                custom={swipeDirection}
                                variants={cardSwipeVariants}
                                initial="enter" animate="center" exit="exit"
                                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.5}
                                onDragEnd={(e, { offset }) => {
                                   const swipeThreshold = 50;
                                   if (offset.x > swipeThreshold) navigateCard('prev');
                                   else if (offset.x < -swipeThreshold) navigateCard('next');
                                }}
                            >
                                <TutorialCard tutorial={tutorials[currentIndex]} animationDelay={0} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <button onClick={() => navigateCard('next')} className="mobile-nav-button next" aria-label="Next tutorial" disabled={tutorials.length <= 1}>
                        <FaChevronRight />
                    </button>
                </div>
            ) : (
                <motion.div 
                    className="tutorial-card-container" // Desktop grid view
                    // Add variants for staggering children if desired for desktop
                    variants={{ animate: { transition: { staggerChildren: 0.08 }} }}
                    initial="initial" // Let Framer Motion handle initial state of children
                    animate="animate"
                > 
                    {tutorials.slice(0, Math.max(3, tutorials.length)).map((tutorial, cardIndex) => (
                        <TutorialCard
                            key={tutorial.id}
                            tutorial={tutorial}
                            // animationDelay is now handled by parent stagger on desktop
                        />
                    ))}
                </motion.div>
            )}
        </section>
    );
};

export default LearnStyleSectionHorizontal;