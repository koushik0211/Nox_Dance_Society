// Nox2/frontend/src/components/Navbar/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css'; 
import { motion } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate(); 
    const location = useLocation(); 

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navbarClasses = `navbar ${scrolled ? 'navbar-scrolled' : ''}`;

    const navVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, delay: 0.2 } }
    };
    const logoVariants = {
        hidden: { scale: 0.5, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 100, delay: 0.5 } }
    };
    const navItemVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };
    const navMenuVariants = {
        hidden: {}, 
        visible: {
            transition: { staggerChildren: 0.1, delayChildren: 0.6 }
        }
    };

    const handleLinkClick = (path) => {
        setIsOpen(false); 

        const [basePath, hash] = path.split('#');
        
        // If it's a direct page link (no hash or hash on a different base path)
        // or if it's a hash link but we're not on the root path (e.g., trying to go to /#learn from /auditions)
        if (!hash || (hash && basePath && basePath !== location.pathname && basePath !== "/")) {
            navigate(path); // Navigate directly to the page (e.g., /learn, /auditions)
                            // Or to the page that contains the hash (e.g., /#learn will take to homepage then scroll)
        } else if (hash && (basePath === "" || basePath === "/" || basePath === location.pathname)) {
             // If it's a hash link for the current page or the homepage
            if (location.pathname !== "/") {
                navigate(path); // Navigate to homepage first if not already there
                // Scrolling will be handled by the browser or useEffect in HomePage for hashes
            } else {
                // Already on homepage, just scroll
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 0);
            }
        } else {
             navigate(path); // Default navigation
        }
    };


    return (
        <motion.nav
            className={navbarClasses}
            variants={navVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="navbar-container cstm-container"> 
                <motion.div
                    className="navbar-logo"
                    variants={logoVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Link to="/" onClick={() => handleLinkClick('/')}>
                        <img src="/assets/noxFoot.png" alt="NOX Logo Small" className="navbar-logo-img"/>
                    </Link>
                </motion.div>

                <button className="menu-icon" onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isOpen}>
                    <div className={isOpen ? 'line line1 open' : 'line line1'}></div>
                    <div className={isOpen ? 'line line2 open' : 'line line2'}></div>
                    <div className={isOpen ? 'line line3 open' : 'line line3'}></div>
                </button>

                <motion.ul
                    className={isOpen ? "nav-menu active" : "nav-menu"}
                    variants={navMenuVariants}
                    initial="hidden" 
                    animate="visible"
                >
                    <motion.li className="nav-item" variants={navItemVariants}>
                        <Link to="/" className="nav-link" onClick={() => handleLinkClick('/')}>
                            HOME
                        </Link>
                    </motion.li>
                    <motion.li className="nav-item" variants={navItemVariants}>
                        {/* LEARN is now a separate page route */}
                        <Link to="/learn" className="nav-link" onClick={() => handleLinkClick('/learn')}>
                            LEARN
                        </Link>
                    </motion.li>
                    <motion.li className="nav-item" variants={navItemVariants}>
    <Link to="/team" className="nav-link" onClick={() => handleLinkClick('/team')}>
        TEAM
    </Link>
</motion.li>
<motion.li className="nav-item" variants={navItemVariants}>
    <Link to="/achievements" className="nav-link" onClick={() => handleLinkClick('/achievements')}>
        ACHIEVEMENTS
    </Link>
</motion.li>
                    <motion.li className="nav-item" variants={navItemVariants}>
                        <Link to="/auditions" className="nav-link nav-link-button" onClick={() => handleLinkClick('/auditions')}>
                            AUDITIONS
                        </Link>
                    </motion.li>
                </motion.ul>
            </div>
        </motion.nav>
    );
};

export default Navbar;