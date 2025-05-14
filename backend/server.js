// backend/server.js

// 1. Import necessary modules
const express = require('express');        // The main Express framework
const dotenv = require('dotenv');          // For loading environment variables from .env file
const cors = require('cors');              // For enabling Cross-Origin Resource Sharing
const connectDB = require('./config/db');  // Your database connection function
const path = require('path');              // Node.js core module for working with file and directory paths

// --- Import your route handlers ---
const auditionRoutes = require('./routes/auditionRoutes');
// Later, you might add:
// const teamRoutes = require('./routes/teamRoutes');
// const tutorialRoutes = require('./routes/tutorialRoutes');
// const achievementRoutes = require('./routes/achievementRoutes');

// 2. Load Environment Variables
// This line loads variables from your .env file into process.env
// Make sure .env is in the root of your 'backend' directory
dotenv.config();

// 3. Connect to MongoDB Database
// This calls the async function you defined in config/db.js
connectDB();

// 4. Initialize Express Application
const app = express();

// 5. Apply Middleware

    // a. CORS (Cross-Origin Resource Sharing) Middleware:
    // This allows your frontend (running on a different port/domain) to make requests to this backend.
    // During development, your frontend is likely on http://localhost:3000
    // and your backend on http://localhost:5001 (or whatever you set in .env).
    // Without CORS, the browser would block these requests for security reasons.
    const allowedOrigins = [
        'http://localhost:3000', // Your frontend development URL
        // Add your deployed frontend URL here later, e.g.:
        // 'https://your-nox-frontend.onrender.com'
    ];
    app.use(cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true // If you plan to use cookies or sessions later
    }));

    // b. Body Parser Middleware:
    // These are built into Express (since Express 4.16.0+) and are used to parse
    // incoming request bodies. This makes `req.body` available with the parsed data.
    // - express.json() parses incoming requests with JSON payloads (e.g., from typical API calls).
    // - express.urlencoded() parses incoming requests with URL-encoded payloads (e.g., from traditional HTML form submissions).
    // For 'multipart/form-data' (which you use for file uploads), 'multer' middleware handles parsing.
    app.use(express.json());
    app.use(express.urlencoded({ extended: false })); // 'extended: false' uses the querystring library

// 6. Define and Mount API Routes

    // When a request comes to a path starting with '/api/auditions',
    // Express will pass it to the 'auditionRoutes' handler.
    app.use('/api/auditions', auditionRoutes);

    // Later, you'll add more routes like:
    // app.use('/api/team', teamRoutes);
    // app.use('/api/tutorials', tutorialRoutes);
    // app.use('/api/achievements', achievementRoutes);

// 7. Serve Static Files (e.g., Uploaded Audition Videos) - OPTIONAL but recommended

    // This tells Express that if a request comes for a path starting with '/uploads',
    // it should look for and serve files from the 'uploads' directory in your backend project.
    // `__dirname` is a Node.js global variable that gives the directory name of the current module (i.e., 'backend/').
    // `path.join` creates a platform-independent path.
    // So, if a video is saved as 'backend/uploads/audition_videos/video1.mp4',
    // it could potentially be accessed via 'http://localhost:5001/uploads/audition_videos/video1.mp4'
    // (depending on how `danceVideoPath` is stored in the database and how you construct the URL in frontend).
    // Make sure the 'uploads' folder is at the root of your 'backend' project.
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// 8. Basic Root Route (for testing if the API is up)
    app.get('/', (req, res) => {
        res.send('NOX Dance Society API is running...');
    });

// 9. Define Port and Start Server

    // Get the port from environment variables, or default to 5001
    const PORT = process.env.PORT || 5001;

    // Start the Express server and listen for incoming connections on the specified port.
    app.listen(PORT, () => {
        console.log(
            `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
        );
    });