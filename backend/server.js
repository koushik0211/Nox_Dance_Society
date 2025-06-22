// backend/server.js

// 1. Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
require('./config/firebaseAdmin'); // This initializes Firebase Admin SDK on server start
const path = require('path');

// --- Import all your route handlers ---
const authRoutes = require('./routes/authRoutes');
const auditionRoutes = require('./routes/auditionRoutes');
const teamRoutes = require('./routes/teamRoutes');
const tutorialRoutes = require('./routes/tutorialRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const auditionRuleRoutes = require('./routes/auditionRuleRoutes');

// 2. Load Environment Variables from .env file
dotenv.config();

// 3. Connect to MongoDB Database
connectDB();

// 4. Initialize Express Application
const app = express();

// 5. Apply Middleware
// a. CORS (Cross-Origin Resource Sharing) Middleware
const allowedOrigins = [
    'https://noxdancesociety.com',
    'https://www.noxdancesociety.com',
    'https://nox-dance-society-front.vercel.app',
    'http://localhost:3000', // For your main frontend dev server
    'http://localhost:3001',
      // For your deployed frontend
      // For your admin frontend dev server if on a different port
    // Add your deployed frontend and admin URLs here later
    // 'https://nox-frontend.onrender.com',
    // 'https://nox-admin.onrender.com'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// b. Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 6. Define and Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auditions', auditionRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/audition-rules', auditionRuleRoutes);

app.use('/api/audition-status', require('./routes/auditionStatusRoutes')); // Add this line


// 7. Serve Static Files section REMOVED as we are using Firebase Storage

// 8. Basic Root Route (for testing if the API is up)
app.get('/', (req, res) => {
    res.send('NOX Dance Society API is running...');
});

// 9. Error Handling Middleware (This must be AFTER all app.use() and routes)
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Use existing status code if set
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

// 10. Define Port and Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
});  


// module.exports = app;


// chnages are made for vercel back end deployement, if want to make normal then make following chnages
// 1. Uncomment the PORT definition and app.listen() block at the end of the file.
// 2.remove api index.js file and use this server.js file directly in your frontend code.
// change start script in package.json to "start": "node server.js" or whatever you name this file.

