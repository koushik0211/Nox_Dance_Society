// frontend/src/admin/services/authService.js

// FIX: Import the 'auth' instance directly, not the 'app'
import { auth } from '../../firebase'; 

// FIX: Import the functions we need to use with the 'auth' instance
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const login = (email, password) => {
    // We use the imported 'auth' instance directly here
    return signInWithEmailAndPassword(auth, email, password);
};

const logout = () => {
    // Use the imported 'auth' instance here as well
    return signOut(auth);
};

const getCurrentUser = () => {
    // The auth instance holds the currently logged-in user
    return auth.currentUser;
};

const getIdToken = async () => {
    const user = auth.currentUser;
    if (user) {
        // Get the ID token from the current user object
        return await user.getIdToken(true); // true forces a refresh
    }
    return null;
};

const authService = {
    login,
    logout,
    getCurrentUser,
    getIdToken
};

export default authService;