// frontend/src/components/LearnPage/LearnPage.js
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { motion } from 'framer-motion';
import LearnStyleSectionHorizontal from './LearnStyleSectionHorizontal';
import axios from 'axios'; // Import axios for API calls
import { FaSpinner } from 'react-icons/fa'; // For loading indicator
import './LearnPage.css';

// The hardcoded `placeholderTutorialsByStyle` is now REMOVED from this file.

const LearnPage = () => {
    // --- NEW STATE VARIABLES ---
    const [tutorialsByStyle, setTutorialsByStyle] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NEW useEffect HOOK TO FETCH DATA ---
    useEffect(() => {
        const fetchTutorials = async () => {
            const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
            try {
                // The backend API at /api/tutorials now returns the data already grouped by style
                const response = await axios.get(`${BACKEND_URL}/api/tutorials`);
                
                // You can add logic here to order the style sections if needed
                // For example:
                const orderedStyles = {};
                const styleOrder = ["Breaking", "Locking", "Hip Hop", "Lite Feet", "Waacking"]; // Define your desired order
                styleOrder.forEach(style => {
                    if (response.data[style]) {
                        orderedStyles[style] = response.data[style];
                    }
                });

                setTutorialsByStyle(orderedStyles);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch tutorials:", err);
                setError("Could not load tutorials. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTutorials();
    }, []); // Empty array ensures this runs once on component mount

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeInOut" } }
    };
    const headerVariants = { /* ... same as before ... */ };
    const backgroundTextFadeIn = { /* ... same as before ... */ };

    return (
        <div className="learn-page-wrapper">
            <motion.div 
                className="nox-background-effect" 
                variants={backgroundTextFadeIn} initial="initial" animate="animate"
            >
                NOX
            </motion.div>
            
            <motion.div 
                className="learn-page-content"
                variants={pageVariants} initial="initial" animate="animate" exit="exit"
            >
                <header className="learn-page-header">
                    <motion.h1 className="learn-page-main-title" variants={headerVariants}>
                        LEARN <span className="learn-page-main-title--highlight">WITH</span>
                    </motion.h1>
                    <motion.p className="learn-page-society-text" variants={headerVariants} transition={{delay: 0.2}}>
                        NOX DANCE SOCIETY
                    </motion.p>
                    <motion.div className="learn-page-header-accent"
                         variants={headerVariants} initial={{scaleX: 0}}
                         animate={{scaleX:1, transition: {delay:0.3, duration: 0.7, ease: "circOut"}}}
                         style={{transformOrigin: 'left'}}
                    ></motion.div>
                </header>

                {/* --- NEW CONDITIONAL RENDERING --- */}
                {loading ? (
                    <div className="loading-spinner-container">
                        <FaSpinner className="loading-spinner" /> Loading Tutorials...
                    </div>
                ) : error ? (
                    <div className="admin-error-message" style={{textAlign: 'center', maxWidth: '600px', margin: '2rem auto'}}>{error}</div>
                ) : (
                    <>
                        {Object.keys(tutorialsByStyle).length > 0 ? (
                            Object.keys(tutorialsByStyle).map((styleName, sectionIndex) => (
                                <LearnStyleSectionHorizontal
                                    key={styleName}
                                    styleName={styleName}
                                    tutorials={tutorialsByStyle[styleName]}
                                    sectionIndex={sectionIndex}
                                />
                            ))
                        ) : (
                            <p className="no-tutorials-message">No tutorials available yet. Check back soon!</p>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default LearnPage;