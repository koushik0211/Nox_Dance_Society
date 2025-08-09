import React from 'react';
import './Hero.css';
import { motion } from 'framer-motion';

const Hero = () => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.4 }
        }
    };

    // Variant for the combined heading block
    const headingBlockVariants = {
        hidden: { x: -100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 70, delay: 0.5 } } // Combined delay
    };

     // Variant for the divider line
     // Inside src/components/Hero/Hero.js - within dividerVariants

const dividerVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
         scaleX: 1,
         opacity: 1,
         transition: {
             duration: 0.8,
             // Replace the array with a keyword:
             ease: 'easeInOut', // Or 'easeOut', 'linear', etc.
             delay: 1.0
        }
    }
};


    const descriptionVariants = { // Separate variant for description
        hidden: { x: -100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 50, delay: 1.2 } }
    };

     const buttonVariants = { // Separate variant for button
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 50, delay: 1.4 } }
    };

     const logoTextVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 50, delay: 1.0 } } // Adjust delay
    }

    const logoVariants = {
         hidden: { scale: 0.5, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 80, delay: 0.6 } } // Adjust delay
    }

    const dancerVariants = {
         hidden: { opacity: 0, x: -50 },
         visible: { opacity: 0.15, x: 0, transition: { duration: 1.5, delay: 0.2, ease: "easeOut" } }
     }

    return (
        <div className="hero-section">
            <motion.div
                className="dancer-silhouette"
                variants={dancerVariants}
                initial="hidden"
                animate="visible"
            >
                <img src="/assets/bg1.jpg" alt="" />
            </motion.div>

            <div className="hero-container container">
                {/* Content Area */}
                <motion.div
                    className="hero-content"
                    variants={containerVariants} // This container staggers its children below
                    initial="hidden"
                    animate="visible"
                >
                    {/* Combined Heading Block */}
                    <motion.div className="hero-heading-block" variants={headingBlockVariants}>
                        <span className="hero-heading-main">Dance is</span>
                        <p className="hero-heading-sub">Our Shared Language!</p>
                    </motion.div>

                    {/* Divider Line */}
                    <motion.div
                        className="heading-divider"
                        variants={dividerVariants}
                     />

                    {/* Description */}
                    <motion.p className="hero-description" variants={descriptionVariants}>
                        We are an all-style Dance crew of Thapar Institute of Engineering and Technology, Patiala. Our society nurtures talent at every level, whether you're a beginner with two left feet or an experienced performer. Through workshops, competitions, flash mobs, cultural fests, and intercollegiate events, we challenge our members to grow and discover their unique dance styles.
                    </motion.p>

                    {/* Button */}
                    <a target='_blank' rel='noreferrer noopener ' href="https://www.youtube.com/watch?v=Bcz-cdc2BB8&t"><motion.button
                         className="hero-button"
                         variants={buttonVariants}
                         whileHover={{ scale: 1.05, backgroundColor: "#a855f7", borderColor: "#a855f7" }}
                         whileTap={{ scale: 0.95 }}
                    >
                        A Glimpse of NOX !
                    </motion.button></a>
                </motion.div>

                {/* Logo Area */}
                <motion.div className="hero-logo-container">
                     <motion.img
                        src="/assets/noxFoot.png"
                        alt="NOX Dance Society Logo"
                        className="hero-logo"
                        variants={logoVariants}
                        initial="hidden"
                        animate="visible"
                     />
                    <motion.p
                        className="hero-logo-text"
                        variants={logoTextVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        NOX DANCE SOCIETY
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;