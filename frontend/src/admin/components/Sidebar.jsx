// frontend/src/admin/components/Sidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaTachometerAlt, FaUsers, FaChalkboardTeacher, FaTrophy, FaGavel, FaSignOutAlt, FaTimes,FaClipboardList } from 'react-icons/fa';
import './Sidebar.css';


// Now accepts isOpen and toggleSidebar props
const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout, adminUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    // Close sidebar when a nav link is clicked on mobile
    const handleLinkClick = () => {
        if (isOpen) {
            toggleSidebar();
        }
    };

    return (
        // Conditionally apply 'open' class for mobile view
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            {/* Add a close button for mobile view */}
            <button 
                onClick={toggleSidebar} 
                className="admin-sidebar__close-btn"
                aria-label="Close navigation menu"
            >
                <FaTimes />
            </button>

            <div className="admin-sidebar__header">
                <div className="admin-sidebar__logo">
                    <h3>Nox</h3>
                </div>
                {adminUser && <p className="admin-sidebar__user-email">{adminUser.email}</p>}
            </div>

            <nav className="admin-sidebar__nav">
                <NavLink to="/admin/dashboard" className="nav-item" onClick={handleLinkClick}><FaTachometerAlt /> Dashboard</NavLink>
                <NavLink to="/admin/team" className="nav-item" onClick={handleLinkClick}><FaUsers /> Team</NavLink>
                <NavLink to="/admin/tutorials" className="nav-item" onClick={handleLinkClick}><FaChalkboardTeacher /> Learn</NavLink>
                <NavLink to="/admin/achievements" className="nav-item" onClick={handleLinkClick}><FaTrophy /> Achievements</NavLink>
                <NavLink to="/admin/rules" className="nav-item" onClick={handleLinkClick}><FaGavel /> Audition Rules</NavLink>
                <NavLink to="/admin/audition-entries" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><FaClipboardList /> Audition Entries</NavLink>

            </nav>

            <button onClick={handleLogout} className="admin-sidebar__logout-btn"><FaSignOutAlt /> Logout</button>
        </aside>
    );
};

export default Sidebar;