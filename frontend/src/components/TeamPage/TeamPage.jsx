import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TeamSection from './TeamSection';
import { FaUserPlus, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import './TeamPage.css';

// Placeholder Data - ENSURE YOU HAVE ENOUGH MEMBERS TO TEST LAYOUTS
// E.g., 5 for Executive, 5 for Core, 10 for Members
const teamData = {
    "Executive Board": [
        { id: 'exec1', name: "Shubham Sharma", year: "3rd Year", position: "Executive Board", imageUrl: "/assets/team/shubham2.jpg", instaUrl: "https://instagram.com/priya", linkedInUrl: "https://linkedin.com/in/priya", intro: "Leading NOX with unmatched passion and a clear vision for artistic excellence. Shubham specializes in contemporary and intricate fusion styles, constantly pushing creative boundaries and inspiring every member to find their unique voice in dance.", specialization: "Contemporary, Fusion Choreography" },
        { id: 'exec2', name: "Tushar", year: "3rd Year", position: "Executive Board", imageUrl: "/assets/team/tushar.jpg", instaUrl: "https://instagram.com/amit", linkedInUrl: "https://linkedin.com/in/amit", intro: "Tushar is the organizational backbone of NOX, ensuring all operations run smoothly. His energetic hip-hop style and meticulous planning skills are invaluable to the team's success on and off stage.", specialization: "Hip Hop, Team Management" },
        { id: 'exec3', name: "Om Verma", year: "3rd Year", position: "Executive Board", imageUrl: "/assets/team/om2.jpg", instaUrl: "https://instagram.com/sneha", linkedInUrl: "https://linkedin.com/in/sneha", intro: "Om masterfully handles all official communications and documentation. Her grace in classical fusion dance translates into her elegant and efficient management of society affairs.", specialization: "Classical Fusion, Kathak" },
        { id: 'exec4', name: "Pearl", year: "3rd Year", position: "Executive Board", imageUrl: "/assets/team/pearl2.jpg", instaUrl: "https://instagram.com/vikram", linkedInUrl: "https://linkedin.com/in/vikram", intro: "With a keen eye for detail, Pearl manages the society's finances, ensuring resources are utilized effectively. His sharp popping skills reflect his precision and dedication.", specialization: "Popping, Financial Management" },
        { id: 'exec5', name: "Gnana Koushik", year: "3rd Year", position: "Executive Board", imageUrl: "/assets/team/koushik2.jpg", instaUrl: "https://instagram.com/rohan", linkedInUrl: "https://linkedin.com/in/rohan", intro: "Koushik is the creative force behind NOX's memorable events and showcases. He brings infectious energy to Jazz Funk and excels at curating unforgettable experiences.", specialization: "Event Management, Jazz Funk" }
    ],
    "Core Team": [
        { id: 'core1', name: "Vansh", year: "2nd Year", position: "Core", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/raj_core", linkedInUrl: "https://linkedin.com/in/raj_core", intro: "Vansh is renowned for his innovative choreography, blending raw hip-hop energy with the emotive storytelling of lyrical dance. He constantly inspires the team to explore new movement vocabularies.", specialization: "Hip-Hop Choreography, Lyrical" },
        { id: 'core2', name: "Krishang", year: "2nd Year", position: "Core", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/ananya_style", linkedInUrl: "https://linkedin.com/in/ananya_style", intro: "Krishang possesses an incredible talent for visual storytelling through costumes. Her designs elevate every performance, perfectly capturing the essence of each dance piece.", specialization: "Costume Design, Folk Dance Aesthetics" },
        { id: 'core3', name: "Pariza", year: "2nd Year", position: "Core", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/karan_media", linkedInUrl: "https://linkedin.com/in/karan_media", intro: "Pariza is the voice of NOX, skillfully managing our online presence and media relations. His sharp Waacking style mirrors his dynamic approach to promoting the society.", specialization: "Social Media Strategy, Waacking" },
        { id: 'core4', name: "Mohan", year: "2nd Year", position: "Core", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/deepika_learns", linkedInUrl: "https://linkedin.com/in/deepika_learns", intro: "Mohan is passionate about dance education, organizing enriching workshops that broaden the team's skills. Her fluid contemporary movements are a testament to her dedication.", specialization: "Contemporary, Salsa, Workshop Curation" },
        { id: 'core5', name: "Ashumika", year: "2nd Year", position: "Core", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/arjun_tech", linkedInUrl: "https://linkedin.com/in/arjun_tech", intro: "Ashumika is the technical wizard ensuring every NOX performance is a seamless audio-visual experience. His powerful Krump style reflects his command over complex systems.", specialization: "Sound Engineering, Lighting Design, Krump" }
    ],
    "Members": [
        { id: 'member1', name: "Aisha Khan", year: "2nd Year", position: "Dancer", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/aisha_dancer", linkedInUrl: "https://linkedin.com/in/aisha_dancer", intro: "Aisha's freestyle is pure fire, bringing raw energy and unpredictability to the stage. She thrives in urban and street dance battles.", specialization: "Freestyle, Urban Dance" },
        { id: 'member2', name: "Ben Carter", year: "1st Year", position: "Dancer", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/ben_c", linkedInUrl: "https://linkedin.com/in/ben_c", intro: "A versatile newcomer, Ben quickly adapts to various hip-hop styles and is known for his dedication and rapid improvement.", specialization: "Hip Hop Basics, Locking" },
        { id: 'member3', name: "Chloe Davis", year: "2nd Year", position: "Dancer", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/chloe_d", linkedInUrl: "https://linkedin.com/in/chloe_d", intro: "Chloe's lyrical dance is poetry in motion. Her expressive movements and emotional depth captivate audiences.", specialization: "Lyrical, Ballet Basics" },
        { id: 'member4', name: "David Evans", year: "3rd Year", position: "Dancer", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/david_b", linkedInUrl: "https://linkedin.com/in/david_b", intro: "David electrifies the stage with his explosive breaking power moves and intricate footwork. A true crowd-pleaser.", specialization: "Breaking, Power Moves" },
        { id: 'member5', name: "Eva Green", year: "1st Year", position: "Dancer", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/eva_g", linkedInUrl: "https://linkedin.com/in/eva_g", intro: "Eva's passion for contemporary dance shines through in every performance. She's known for her fluid transitions and strong stage presence.", specialization: "Contemporary, Jazz Funk" },
        { id: 'member6', name: "Finn Harris", year: "2nd Year", position: "Dancer", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/finn_h", linkedInUrl: "https://linkedin.com/in/finn_h", intro: "Finn masters complex popping and animation techniques with precision. His robotic illusions are mesmerizing.", specialization: "Popping, Animation" },
        { id: 'member7', name: "Grace Irwin", year: "1st Year", position: "Dancer", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/grace_i", linkedInUrl: "https://linkedin.com/in/grace_i", intro: "Grace is dedicated to her craft, showing great promise in Jazz and commercial dance styles with her clean lines and energy.", specialization: "Jazz, Commercial Hip Hop" },
        { id: 'member8', name: "Henry Jones", year: "3rd Year", position: "Dancer", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/henry_j", linkedInUrl: "https://linkedin.com/in/henry_j", intro: "Henry's urban choreography and captivating stage presence make him a standout performer in group pieces.", specialization: "Urban Choreography, House Dance" },
        { id: 'member9', name: "Isla King", year: "2nd Year", position: "Dancer", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/isla_k", linkedInUrl: "https://linkedin.com/in/isla_k", intro: "Isla shows great potential and versatility, quickly picking up new styles and contributing strong performances.", specialization: "Ballet Fusion, Contemporary" },
        { id: 'member10', name: "Jack Lewis", year: "1st Year", position: "Dancer", imageUrl: "/assets/team/member_placeholder.png", instaUrl: "https://instagram.com/jack_l", linkedInUrl: "https://linkedin.com/in/jack_l", intro: "Jack is an eager learner with a natural knack for locking and funk styles, always bringing a positive attitude.", specialization: "Locking, Funk Styles" }
    ]
};

const TeamPage = () => {
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

                {Object.keys(teamData).map((sectionTitle, index) => (
                    <TeamSection
                        key={sectionTitle}
                        title={sectionTitle}
                        members={teamData[sectionTitle]}
                        sectionAnimationDelay={index * 0.25} // Slightly adjusted delay
                    />
                ))}

                <section className="team-page-section team-page-join-us-section">
                    <motion.div 
                        className="join-us-decorative-element join-us-decorative-element--left"
                        initial={{ opacity: 0, x: -40 }} 
                        whileInView={{ opacity: 1, x: 0 }} 
                        viewport={{ once: true, amount:0.4}} 
                        transition={{delay:0.3, type: "spring", stiffness:50}}
                    >
                        <FaAngleDoubleLeft />
                        <span>JOIN THE MOVEMENT</span> {/* Changed text */}
                        <FaAngleDoubleLeft />
                    </motion.div>
                    
                    <motion.div 
                        className="maybe-you-card-v2" 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ type: "spring", stiffness: 80, delay: 0.1}} // Faster spring
                    >
                        <h3 className="maybe-you-card-v2__title">Maybe <span className="maybe-you-card-v2__title--highlight">You!</span></h3>
                        <div className="maybe-you-card-v2__icon-wrapper">
                            <FaUserPlus className="maybe-you-card-v2__icon" />
                        </div>
                        <p className="maybe-you-card-v2__text">Ready to step into the spotlight? <br/>NOX is calling for passionate dancers.</p>
                        <Link to="/auditions" className="maybe-you-card-v2__button">
                            Register for Auditions!
                        </Link>
                    </motion.div>

                    <motion.div 
                        className="join-us-decorative-element join-us-decorative-element--right"
                        initial={{ opacity: 0, x: 40 }} 
                        whileInView={{ opacity: 1, x: 0 }} 
                        viewport={{ once: true, amount:0.4}} 
                        transition={{delay:0.3, type: "spring", stiffness:50}}
                    >
                        <FaAngleDoubleRight />
                        <span>IGNITE THE STAGE</span> {/* Changed text */}
                        <FaAngleDoubleRight />
                    </motion.div>
                </section>
            </motion.div>
        </div>
    );
};

export default TeamPage;