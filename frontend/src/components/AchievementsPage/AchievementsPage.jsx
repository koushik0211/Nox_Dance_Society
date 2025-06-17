// frontend/src/components/AchievementsPage/AchievementsPage.js
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { motion } from 'framer-motion';
import AchievementCard from './AchievementCard';
import axios from 'axios'; // Import axios for API calls
import { FaSpinner } from 'react-icons/fa'; // For loading indicator
import './AchievementsPage.css';

// Placeholder for CURRENT team data (needed for the modal)
// In a real app, this might come from context or a separate API call.
const currentTeamMembersData = [
    { id: 'exec1', name: "Priya Sharma", position: "President" }, { id: 'exec2', name: "Amit Singh", position: "Vice President" },
    { id: 'exec3', name: "Sneha Reddy", position: "General Secretary" }, { id: 'exec4', name: "Vikram Kumar", position: "Treasurer" },
    { id: 'exec5', name: "Rohan Verma", position: "Events Head" },
    { id: 'core1', name: "Raj Patel", position: "Choreography Head" }, { id: 'core2', name: "Ananya Joshi", position: "Costume & Styling Head" },
    { id: 'core3', name: "Karan Mehta", position: "PR & Media Head" }, { id: 'core4', name: "Deepika Rao", position: "Workshop Coordinator" },
    { id: 'core5', name: "Arjun Desai", position: "Technical Head" },
    { id: 'member1', name: "Aisha Khan", position: "Dancer" }, { id: 'member2', name: "Ben Carter", position: "Dancer" },
    { id: 'member3', name: "Chloe Davis", position: "Dancer"}, { id: 'member4', name: "David Evans", position: "Dancer"},
    { id: 'member5', name: "Eva Green", position: "Dancer" }, { id: 'member6', name: "Finn Harris", position: "Dancer"},
    { id: 'member7', name: "Grace Irwin", position: "Dancer" }, { id: 'member8', name: "Henry Jones", position: "Dancer"},
    { id: 'member9', name: "Isla King", position: "Dancer" }, { id: 'member10', name: "Jack Lewis", position: "Dancer" }
];


const AchievementsPage = () => {
    // --- NEW STATE VARIABLES ---
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NEW useEffect HOOK TO FETCH DATA ---
    useEffect(() => {
        const fetchAchievements = async () => {
            const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
            
            try {
                // Make the API call to your public GET endpoint for achievements
                const response = await axios.get(`${BACKEND_URL}/api/achievements`);
                
                // The backend already sorts the data by year, so we can use it directly
                setAchievements(response.data);
                setError(null);

            } catch (err) {
                console.error("Failed to fetch achievements:", err);
                setError("Could not load achievements. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []); // Empty array ensures this runs once on component mount

    const pageVariants = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delayChildren: 0.3 } },
        exit: { opacity: 0, y: -30, transition: { duration: 0.5, ease: "easeIn" } }
    };
    const headerVariants = { /* ... same as before ... */ };
    const backgroundTextFadeIn = { /* ... same as before ... */ };

    return (
        <div className="achievements-page-wrapper">
            <motion.div 
                className="achievements-page-bg-text achievements-page-bg-text--large-center"
                variants={backgroundTextFadeIn} initial="initial" animate="animate"
            >
                VICTORIES 
            </motion.div>

            <motion.div
                className="achievements-page-content"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <header className="achievements-page-header">
                    <motion.h1 className="achievements-page-main-title" variants={headerVariants}>
                        OUR <span className="achievements-page-main-title--highlight">TROPHY</span> SHELF
                    </motion.h1>
                    <motion.p className="achievements-page-sub-title" variants={headerVariants} transition={{delay:0.2}}>
                        Celebrating NOX's Journey of Excellence and Achievements
                    </motion.p>
                    <motion.div className="achievements-page-header-accent"
                         variants={headerVariants} initial={{scaleX: 0}}
                         animate={{scaleX:1, transition: {delay:0.3, duration: 0.7, ease: "circOut"}}}
                         style={{transformOrigin: 'center'}}
                    ></motion.div>
                </header>

                {/* --- NEW CONDITIONAL RENDERING --- */}
                {loading ? (
                    <div className="loading-spinner-container">
                        <FaSpinner className="loading-spinner" /> Loading Achievements...
                    </div>
                ) : error ? (
                    <div className="admin-error-message" style={{textAlign: 'center', maxWidth: '600px', margin: '2rem auto'}}>{error}</div>
                ) : (
                    <div className="achievements-list">
                        {achievements.length > 0 ? (
                            achievements.map((achievement, index) => (
                                <AchievementCard 
                                    key={achievement._id} // Use database _id for key
                                    achievement={achievement}
                                    currentTeamMembers={currentTeamMembersData} 
                                />
                            ))
                        ) : (
                            <p className="no-achievements-message">Our trophy shelf is waiting for its next additions! Check back soon.</p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AchievementsPage;