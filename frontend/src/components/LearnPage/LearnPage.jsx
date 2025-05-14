import React from 'react';
import { motion } from 'framer-motion';
import TutorialCard from './TutorialCard';
import './LearnPage.css';

// Placeholder Data - Make sure paths to videos and thumbnails are correct relative to your `public` folder
const placeholderTutorialsByStyle = {
    "Breaking": [
        {
            id: 1,
            title: "Baby Freeze",
            videoUrl: "/assets/learn/videos/breaking_flare.mp4", 
            thumbnailUrl: "/assets/learn/thumbnails/breaking_flare_thumb.jpg", 
            description: "Learn the foundational movements and techniques for executing a clean freeze.",
            instructor: "Tushar",
            instructorInstaUrl: "https://instagram.com/bboy_spin_nox", 
            difficulty: "Advanced",
            tags: ["Power Moves", "Freeze"]
        },
        {
            id: 2,
            title: "Toprock Grooves",
            videoUrl: "/assets/learn/videos/breaking_toprock.mp4",
            thumbnailUrl: "/assets/learn/thumbnails/breaking_toprock_thumb.jpg",
            description: "Master essential toprock steps and add your own flavor to your breaking entries.",
            instructor: "Tushar",
            instructorInstaUrl: "https://instagram.com/bgirl_flow_nox",
            difficulty: "Beginner",
            tags: ["Toprock", "Foundation"]
        },
        {
            id: 3,
            title: "Footwork Drills",
            videoUrl: "/assets/learn/videos/breaking_footwork.mp4",
            thumbnailUrl: "/assets/learn/thumbnails/breaking_footwork_thumb.jpg",
            description: "Sharpen your 6-step and other core footwork patterns with these effective drills.",
            instructor: "Tushar",
            instructorInstaUrl: "https://instagram.com/kicks_nox",
            difficulty: "Intermediate",
            tags: ["Footwork", "Drills", "6-Step"]
        }
    ],
    "Locking": [
        {
            id: 4,
            title: "The Basic Lock",
            videoUrl: "/assets/learn/videos/locking_basic.mp4",
            thumbnailUrl: "/assets/learn/thumbnails/locking_basic_thumb.jpg",
            description: "Understand the mechanics and feeling behind the fundamental Lock.",
            instructor: "Om verma",
            instructorInstaUrl: "https://instagram.com/funkmaster_nox",
            difficulty: "Beginner",
            tags: ["Locking", "Foundation"]
        },
        {
            id: 5,
            title: "Points & Wrist Rolls",
            videoUrl: "/assets/learn/videos/locking_points.mp4",
            thumbnailUrl: "/assets/learn/thumbnails/locking_points_thumb.jpg",
            description: "Add flair with classic locking points and smooth wrist roll techniques.",
            instructor: "Om Verma",
            instructorInstaUrl: "https://instagram.com/ladylock_nox",
            difficulty: "Beginner",
            tags: ["Points", "Wrist Rolls"]
        },
        {
            id: 6,
            title: "Skeeter Rabbit Variations",
            videoUrl: "/assets/learn/videos/locking_skeeter.mp4",
            thumbnailUrl: "/assets/learn/thumbnails/locking_skeeter_thumb.jpg",
            description: "Explore different variations of the iconic Skeeter Rabbit step.",
            instructor: "Om Verma",
            instructorInstaUrl: "https://instagram.com/funksoul_nox",
            difficulty: "Intermediate",
            tags: ["Skeeter Rabbit", "Variations"]
        }
    ],
    "Hip Hop": [
        {
            id: 7,
            title: "Groove Foundations",
            videoUrl: "/assets/learn/videos/hiphop_grooves.mp4",
            thumbnailUrl: "/assets/learn/thumbnails/hiphop_grooves_thumb.jpg",
            description: "Connect with the music and find your bounce with these core hip hop grooves.",
            instructor: "Shubham",
            instructorInstaUrl: "https://instagram.com/flowkilla_nox",
            difficulty: "All Levels",
            tags: ["Grooves", "Musicality"]
        },
        {
            id: 8,
            title: "Isolation Techniques",
            videoUrl: "/assets/learn/videos/hiphop_isolations.mp4",
            thumbnailUrl: "/assets/learn/thumbnails/hiphop_isolations_thumb.jpg",
            description: "Master body control with sharp and clean isolation exercises.",
            instructor: "Shubham",
            instructorInstaUrl: "https://instagram.com/sharpshooter_nox",
            difficulty: "Intermediate",
            tags: ["Isolations", "Control"]
        },
        {
            id: 9,
            title: "Dynamic Textures",
            videoUrl: "/assets/learn/videos/hiphop_textures.mp4",
            thumbnailUrl: "/assets/learn/thumbnails/hiphop_textures_thumb.jpg",
            description: "Learn to add different textures like hits, waves, and robotics to your movement.",
            instructor: "Shubham",
            instructorInstaUrl: "https://instagram.com/glitchqueen_nox",
            difficulty: "Intermediate",
            tags: ["Textures", "Dynamics"]
        }
    ]
};


const LearnPage = () => {
    const tutorialsByStyle = placeholderTutorialsByStyle;

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut", delayChildren: 0.2, staggerChildren: 0.1 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeInOut" } }
    };
    const headerVariants = {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, delay: 0.1 }}
    };
    const sectionTitleVariants = {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, delay: 0.1 }}
    };
    const backgroundTextFadeIn = { // For the ".nox-background-effect" text
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 2, delay: 0.5, ease: [0.25, 1, 0.5, 1] }} 
    };

    return (
        <div className="learn-page-wrapper"> {/* This div gets the overall page background from learn.css */}
            {/* This div is for the large "NOX" background text effect from learn.css */}
            <motion.div 
                className="nox-background-effect" // Class directly from your learn.css
                variants={backgroundTextFadeIn} 
                initial="initial" 
                animate="animate"
            >
                NOX {/* Text content for the effect, styled by .nox-background-effect */}
            </motion.div>
            
            {/* The main content area that scrolls over the fixed background effect */}
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

                {Object.keys(tutorialsByStyle).map((styleName, sectionIndex) => (
                    <section key={styleName} className="learn-style-section">
                        <motion.h2 
                            className="learn-style-section__title"
                            variants={sectionTitleVariants}
                            initial="initial" 
                            whileInView="animate" 
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            {styleName}
                        </motion.h2>
                        <div className="tutorial-card-container">
                            {tutorialsByStyle[styleName].slice(0, Math.max(3, tutorialsByStyle[styleName].length)).map((tutorial, cardIndex) => (
                                <TutorialCard
                                    key={tutorial.id}
                                    tutorial={tutorial}
                                    animationDelay={(sectionIndex * 0.15) + (cardIndex * 0.08)} 
                                />
                            ))}
                        </div>
                        {tutorialsByStyle[styleName].length === 0 && <p className="no-tutorials-message">No tutorials available for {styleName} yet. Stay tuned!</p>}
                    </section>
                ))}
                {Object.keys(tutorialsByStyle).length === 0 && <p className="no-tutorials-message">No tutorial categories available yet. Check back soon!</p>}
            </motion.div>
        </div>
    );
};

export default LearnPage;