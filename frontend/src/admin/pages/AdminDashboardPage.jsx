// frontend/src/admin/pages/AdminDashboardPage.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaChalkboardTeacher, FaTrophy, FaGavel, FaClipboardList } from 'react-icons/fa'; // Added FaClipboardList
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
    const { adminUser } = useAuth();

    // Stagger animation for the parent container of cards
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Stagger the children
                delayChildren: 0.2,   // Start after a small delay
            }
        }
    };

    // Animation for individual items (cards)
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="admin-dashboard">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h1 className="admin-dashboard__title">
                Welcome, <span>{adminUser?.email.split('@')[0] || 'Admin'}</span>!
                </h1>
                <p className="admin-dashboard__subtitle">
                    Manage noxdancesociety.com effectively from this central hub.
                </p>
            </motion.div>
            
            {/* Using a motion.div as the container for staggering card animations */}
            <motion.div 
                className="admin-dashboard__quick-links"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Each card is now a motion.div */}
                <motion.div variants={itemVariants}>
                    <Link to="/admin/team" className="quick-link-card">
                        <FaUsers className="quick-link-icon" />
                        <span className="quick-link-title">Manage Team</span>
                        <span className="quick-link-desc">Add, edit, or remove society members.</span>
                    </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Link to="/admin/tutorials" className="quick-link-card">
                        <FaChalkboardTeacher className="quick-link-icon" />
                        <span className="quick-link-title">Manage Learn Page</span>
                        <span className="quick-link-desc">Upload new tutorials and manage categories.</span>
                    </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Link to="/admin/achievements" className="quick-link-card">
                        <FaTrophy className="quick-link-icon" />
                        <span className="quick-link-title">Manage Achievements</span>
                        <span className="quick-link-desc">Showcase the latest wins and milestones.</span>
                    </Link>
                </motion.div>

                {/* ADDED THE TWO MISSING CARDS */}
                <motion.div variants={itemVariants}>
                    <Link to="/admin/rules" className="quick-link-card">
                        <FaGavel className="quick-link-icon" />
                        <span className="quick-link-title">Manage Audition Rules</span>
                        <span className="quick-link-desc">Update rules and event details for auditions.</span>
                    </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Link to="/admin/audition-entries" className="quick-link-card">
                        <FaClipboardList className="quick-link-icon" />
                        <span className="quick-link-title">View Audition Entries</span>
                        <span className="quick-link-desc">Review submissions and judge candidates.</span>
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div 
                className="dashboard-info-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <h3>Quick Guide</h3>
                <ul>
                    <li>Use the sidebar for quick navigation to any section.</li>
                    <li>The **Manage Team** section is for updating the official member roster.</li>
                    <li>The **View Audition Entries** section is for the judging process.</li>
                    <li>Remember to **log out** when you are finished.</li>
                </ul>
            </motion.div>
        </div>
    );
};

export default AdminDashboardPage;