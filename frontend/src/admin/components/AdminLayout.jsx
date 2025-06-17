// frontend/src/admin/components/AdminLayout.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa'; // Hamburger icon
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="admin-layout">
            {/* Sidebar receives props to handle its mobile state */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            />
            
            {/* Main content area */}
            <main className="admin-main-content">
                {/* Mobile Header with Hamburger Button */}
                <header className="admin-mobile-header">
                    <div className="admin-mobile-header__logo">ADMIN</div>
                    <button 
                        onClick={toggleSidebar} 
                        className="admin-mobile-header__menu-button"
                        aria-label="Toggle navigation menu"
                    >
                        <FaBars />
                    </button>
                </header>

                <div className="admin-content-wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;