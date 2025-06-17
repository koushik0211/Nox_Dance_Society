import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AdminLoginPage.css'; // We'll create this CSS file

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, isLoggedIn } = useAuth(); // Get login function and current logged-in status
    const navigate = useNavigate();
    const location = useLocation();
    
    // The path to redirect to after successful login.
    // If the user was redirected from a protected page, 'from' will be set.
    const from = location.state?.from?.pathname || "/admin/dashboard";

    // If the user is already logged in, redirect them away from the login page.
    useEffect(() => {
        if (isLoggedIn) {
            navigate(from, { replace: true });
        }
    }, [isLoggedIn, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            // Use the login function from AuthContext, which calls Firebase
            await login(email, password);
            // On success, the useEffect above will handle the redirect.
            // Or you can navigate immediately here as well.
            navigate(from, { replace: true });
        } catch (err) {
            // Handle specific Firebase auth errors for better user feedback
            let friendlyError = "Login failed. Please check your credentials.";
            if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                friendlyError = "Invalid email or password.";
            } else if (err.code === 'auth/too-many-requests') {
                friendlyError = "Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.";
            }
            console.error("Admin Login Failed:", err);
            setError(friendlyError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <motion.div 
                className="admin-login-form-container"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="admin-login-logo">
                    {/* You can place your NOX logo image here if you have one */}
                    {/* <img src="/assets/logo.png" alt="NOX Logo" /> */}
                    <h2>NOX Admin Portal</h2>
                </div>
                
                {error && (
                    <motion.p 
                        className="admin-error-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {error}
                    </motion.p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder="admin@example.com"
                            disabled={loading}
                        />
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>
                    <motion.button 
                        type="submit" 
                        className="admin-submit-button" 
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.03 }}
                        whileTap={{ scale: loading ? 1 : 0.97 }}
                    >
                        {loading ? 'Logging In...' : 'Login'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;