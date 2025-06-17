// src/admin/contexts/AuthContext.jsx

// FIX: Import useState, useEffect, createContext, and useContext from React
import React, { createContext, useState, useContext, useEffect } from 'react'; 

// FIX: Import the auth instance directly from your firebase config file
import { auth } from '../../firebase'; 

// FIX: signInWithEmailAndPassword, signOut, onAuthStateChanged are imported here to be used with the 'auth' instance
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        // onAuthStateChanged listens for changes in the user's login state.
        // It takes the auth instance directly as its first argument.
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAdminUser(user); // 'user' will be the Firebase user object or null if logged out
            setLoading(false);  // Finished the initial check
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe(); 
    }, []); // The empty dependency array means this effect runs only once on mount

    const login = (email, password) => {
        // This function now just calls the Firebase function with the imported auth instance
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const getIdToken = async () => {
        if (adminUser) {
            return await adminUser.getIdToken(true); // true forces a token refresh if needed
        }
        return null;
    };

    const value = {
        adminUser,
        isLoggedIn: !!adminUser, // A convenient boolean: true if user exists, false if null
        loading,
        login,
        logout,
        getIdToken
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Don't render the rest of the app until the initial auth check is complete */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};

// Custom hook to easily use the auth context in other components
export const useAuth = () => {
    return useContext(AuthContext);
}; 