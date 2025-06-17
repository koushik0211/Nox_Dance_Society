// Nox2/frontend/src/components/TeamPage/TeamPage.js
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TeamSection from './TeamSection';
import axios from 'axios'; // Import axios for making API calls
import { FaUserPlus, FaAngleDoubleLeft, FaAngleDoubleRight, FaSpinner } from 'react-icons/fa';
import './TeamPage.css';

// The hardcoded `teamData` object is now REMOVED from this file.
// We will fetch this data from the backend.

const TeamPage = () => {
    // --- NEW STATE VARIABLES ---
    const [teamData, setTeamData] = useState({}); // To store fetched data, starts as an empty object
    const [loading, setLoading] = useState(true); // To show a loading indicator
    const [error, setError] = useState(null);    // To show an error message if fetching fails

    // --- NEW useEffect HOOK TO FETCH DATA ---
    useEffect(() => {
        const fetchTeamData = async () => {
            // Get the backend URL from environment variable, with a fallback for local development
            const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
            
            try {
                // Make the API call to your public GET endpoint
                const response = await axios.get(`${BACKEND_URL}/api/team`);
                
                // The backend team controller should return an array of members.
                // We need to group them by category for the TeamSection component.
                const groupedData = response.data.reduce((acc, member) => {
                    const category = member.category;
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(member);
                    return acc;
                }, {});

                // Sort the categories in the desired order
                const orderedGroupedData = {};
                const categoryOrder = ['Executive Board', 'Core Team', 'Members'];
                categoryOrder.forEach(category => {
                    if (groupedData[category]) {
                        orderedGroupedData[category] = groupedData[category];
                    }
                });

                setTeamData(orderedGroupedData); // Update state with the fetched and grouped data
                setError(null); // Clear any previous errors

            } catch (err) {
                console.error("Failed to fetch team data:", err);
                setError("Could not load team members. Please try again later.");
            } finally {
                setLoading(false); // Stop loading, whether successful or not
            }
        };

        fetchTeamData();
    }, []); // The empty dependency array [] means this effect runs only once when the component mounts.

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeInOut" } }
    };
    const headerVariants = {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, delay: 0.1 }}
    };
     const backgroundTextFadeIn = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 1.8, delay: 0.4, ease: [0.25, 1, 0.5, 1] }} 
    };

    return (
        <div className="team-page-wrapper">
             <motion.div 
                className="team-page-bg-text team-page-bg-text--large-center"
                variants={backgroundTextFadeIn} initial="initial" animate="animate"
            >
                TEAM 
            </motion.div>

            <motion.div
                className="team-page-content"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <header className="team-page-header">
                    <motion.h1 className="team-page-main-title" variants={headerVariants}>
                        MEET THE <span className="team-page-main-title--highlight">NOX FAMILY</span>
                    </motion.h1>
                    <motion.p className="team-page-sub-title" variants={headerVariants} transition={{delay:0.2}}>
                        The Heartbeat of Our Society
                    </motion.p>
                     <motion.div className="team-page-header-accent"
                         variants={headerVariants} initial={{scaleX: 0}}
                         animate={{scaleX:1, transition: {delay:0.3, duration: 0.7, ease: "circOut"}}}
                         style={{transformOrigin: 'center'}}
                    ></motion.div>
                </header>
                
                {/* --- NEW CONDITIONAL RENDERING --- */}
                {loading ? (
                    <div className="loading-spinner-container">
                        <FaSpinner className="loading-spinner" /> Loading Team...
                    </div>
                ) : error ? (
                    <div className="admin-error-message">{error}</div> // Reuse error message style
                ) : (
                    <>
                        {Object.keys(teamData).map((sectionTitle, index) => (
                            <TeamSection
                                key={sectionTitle}
                                title={sectionTitle}
                                members={teamData[sectionTitle]}
                                sectionAnimationDelay={index * 0.2} 
                            />
                        ))}

                        <section className="team-page-section team-page-join-us-section">
                            <motion.div className="join-us-decorative-element join-us-decorative-element--left" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount:0.4}} transition={{delay:0.3, type: "spring", stiffness:50}} > <FaAngleDoubleLeft /> <span>JOIN THE MOVEMENT</span> <FaAngleDoubleLeft /> </motion.div>
                            <motion.div className="maybe-you-card-v2" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ type: "spring", stiffness: 80, delay: 0.1}} > <h3 className="maybe-you-card-v2__title">Maybe <span className="maybe-you-card-v2__title--highlight">You!</span></h3> <div className="maybe-you-card-v2__icon-wrapper"> <FaUserPlus className="maybe-you-card-v2__icon" /> </div> <p className="maybe-you-card-v2__text">Ready to step into the spotlight? <br/>NOX is calling for passionate dancers.</p> <Link to="/auditions" className="maybe-you-card-v2__button"> Register for Auditions! </Link> </motion.div>
                            <motion.div className="join-us-decorative-element join-us-decorative-element--right" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount:0.4}} transition={{delay:0.3, type: "spring", stiffness:50}} > <FaAngleDoubleRight /> <span>IGNITE THE STAGE</span> <FaAngleDoubleRight /> </motion.div>
                        </section>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default TeamPage;