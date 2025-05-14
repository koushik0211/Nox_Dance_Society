import React from 'react';
import { motion } from 'framer-motion';
import AchievementCard from './AchievementCard'; // Using the V3 card component
import './AchievementsPage.css';

// Placeholder Data - ENSURE YOU HAVE ACTUAL OR GOOD PLACEHOLDER DATA
// AND THAT teamMemberIdsInvolved MATCHES IDs IN currentTeamMembersData
const achievementsData = [
    { 
        id: 'ach1', 
        year: "2024", 
        title: "1ST PLACE - OASIS'24, BITS PILANI", 
        imageUrl: "/assets/achievements/bits.jpg", // *** USE YOUR ACTUAL IMAGE PATH ***
        description: "We secured the FIRST position in Razzmatazz'24 organized by BITS PILANI with our spectacular group performance.", 
        teamMemberIdsInvolved: ['exec1', 'core1', 'member1', 'member2', 'pastMemberXYZ'], 
    },
    { 
        id: 'ach2', 
        year: "2024", 
        title: "1ST PLACE - ZEITGEIST'24, IIT ROPAR", 
        imageUrl: "/assets/achievements/ropar.jpg", // *** USE YOUR ACTUAL IMAGE PATH ***
        description: "We secured the FIRST position in Xuberance'24 organized by IIT ROPAR with our spectacular group performance.", 
        teamMemberIdsInvolved: ['member4', 'member6', 'core3'], 
    },
     { 
        id: 'ach3', 
        year: "2023", 
        title: "Runners Up - SAVISKAR'24, CGC MOHALI", 
        imageUrl: "/assets/achievements/cgc.jpg", // *** USE YOUR ACTUAL IMAGE PATH ***
        description: "Secured the Runners Up position in the group dance competition held during Saviskar held at cgc mohali.", 
        teamMemberIdsInvolved: ['exec1','exec2','core1', 'member3', 'member4'], 
    },
    // Add more achievements following this simplified structure
];

// Placeholder current team data (needed for the modal)
// Ensure IDs here match what you might use in teamMemberIdsInvolved
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
    const pageVariants = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delayChildren: 0.3 } }, 
        exit: { opacity: 0, y: -30, transition: { duration: 0.5, ease: "easeIn" } }
    };
    const headerVariants = {
        initial: { opacity: 0, y: -40, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 15, delay: 0.1 }}
    };
    const backgroundTextFadeIn = {
        initial: { opacity: 0, scale: 1.2 },
        animate: { opacity: 1, scale: 1, transition: { duration: 2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} 
    };

    const sortedAchievements = [...achievementsData].sort((a, b) => {
        if (b.year !== a.year) {
            return parseInt(b.year) - parseInt(a.year);
        }
        return a.title.localeCompare(b.title);
    });

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

                <div className="achievements-list"> {/* Using list class for single column */}
                    {sortedAchievements.length > 0 ? (
                        sortedAchievements.map((achievement) => ( // No index needed if card handles its own whileInView
                            <AchievementCard 
                                key={achievement.id} 
                                achievement={achievement}
                                currentTeamMembers={currentTeamMembersData} 
                            />
                        ))
                    ) : (
                        <p className="no-achievements-message">Our trophy shelf is waiting for its next additions!</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AchievementsPage;