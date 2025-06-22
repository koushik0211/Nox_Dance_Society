import React from 'react';
import './Footer.css';
import { motion } from 'framer-motion';
// Import icons from react-icons
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // Animation variants
    const footerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 50,
                delay: 0.2,
                when: "beforeChildren", // Animate container first
                staggerChildren: 0.2 // Stagger animation of children
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 80 }
        }
    };

    return (
        <motion.footer
            className="footer"
            variants={footerVariants}
            initial="hidden"
            // Animate when the footer scrolls into view
            whileInView="visible"
            // Only animate once when it enters the viewport
            viewport={{ once: true, amount: 0.3 }} // Trigger when 30% is visible
        >
            <div className="footer-container container">
                {/* Top Section */}
                <motion.div className="footer-top" variants={itemVariants}>
                    <motion.div className="footer-logo" variants={itemVariants}>
                        <img src="/assets/noxFoot.png" alt="NOX Logo Small" />
                    </motion.div>

                    <motion.div className="footer-message" variants={itemVariants}>
                        <p>
                            "Feel free to meet our team in the <span className="highlight">Nox Room</span> any day between 5:30 and 8:00 PM."
                        </p>
                    </motion.div>

                    <motion.div className="footer-social" variants={itemVariants}>
                        <h4>Useful Links</h4>
                        <div className="social-icons">
                            <motion.a href="https://www.instagram.com/nox_dance_society/?hl=en" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, color: '#a855f7' }} title="Instagram">
                                <FaInstagram />
                            </motion.a>
                            <motion.a href="https://youtube.com" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, color: '#a855f7' }} title="YouTube">
                                <FaYoutube />
                            </motion.a>
                            <motion.a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, color: '#a855f7' }} title="LinkedIn">
                                <FaLinkedin />
                            </motion.a>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Separator */}
                <motion.hr className="footer-separator" variants={itemVariants} />

                {/* Bottom Section */}
                <motion.div className="footer-bottom" variants={itemVariants}>
                    <p className="copyright">
                        Copyright © {currentYear} NOX. All Rights Reserved.
                    </p>
                    <p className="designed-by">
                        Designed by <span className="highlight">Koushik</span>.
                    </p>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;