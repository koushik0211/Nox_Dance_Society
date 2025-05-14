import React from 'react';
import { motion } from 'framer-motion';
import TeamMemberCard from './TeamMemberCard';

const TeamSection = ({ title, members, sectionAnimationDelay }) => {
    const sectionTitleVariants = {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, delay: sectionAnimationDelay } }
    };

    const cardContainerVariants = {
        initial: {}, // No initial animation for container itself
        animate: {
            transition: {
                staggerChildren: 0.1, // Stagger children cards
                delayChildren: sectionAnimationDelay + 0.2 // Delay after title appears
            }
        }
    };

    return (
        <section className="team-page-section">
            <motion.h2
                className="team-page-section__title"
                variants={sectionTitleVariants}
                initial="initial"
                whileInView="animate" // Animate when it scrolls into view
                viewport={{ once: true, amount: 0.2 }} // Trigger once, when 20% visible
            >
                {title}
            </motion.h2>
            <motion.div
                className="team-member-card-container"
                variants={cardContainerVariants}
                initial="initial" // Children will inherit and animate based on stagger
                animate="animate" // This will trigger staggerChildren for cards
            >
                {members.map((member, index) => (
                    <TeamMemberCard
                        key={member.id}
                        member={member}
                        // animationDelay is now handled by staggerChildren in parent motion.div
                        // If direct delay needed: animationDelay={index * 0.08}
                    />
                ))}
            </motion.div>
        </section>
    );
};

export default TeamSection;