// backend/middleware/authMiddleware.js
const admin = require('../config/firebaseAdmin');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // verifyIdToken will automatically fetch the latest claims
            const decodedToken = await admin.auth().verifyIdToken(token);
            
            // Attach the decoded token (which includes claims) to the request object
            req.user = decodedToken;
            
            next();
        } catch (error) {
            console.error('Firebase ID Token verification error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const isAdmin = (req, res, next) => {
    // The decoded token is on req.user from the 'protect' middleware
    // We check if the 'admin' custom claim is true.
    if (req.user && req.user.admin === true) {
        // User is an admin, proceed to the controller
        next();
    } else {
        // User is authenticated but NOT an admin
        res.status(403).json({ message: 'Forbidden: Not authorized as an admin.' });
    }
};

module.exports = { protect, isAdmin };