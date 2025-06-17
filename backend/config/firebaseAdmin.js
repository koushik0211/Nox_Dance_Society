// backend/config/firebaseAdmin.js
const admin = require('firebase-admin');
// const path = require('path'); // Not strictly needed if service key path is direct

// Path to your service account key JSON file
// Assumes it's in the same 'config' directory as this file
const serviceAccount = require('./firebaseServiceAccountKey.json'); 

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // storageBucket is required if the Admin SDK needs to interact with Storage
        // (e.g., deleting files, generating signed URLs from the backend).
        // It should be the same value as your frontend's REACT_APP_FIREBASE_STORAGE_BUCKET.
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // <<< Use backend env variable
        projectId: process.env.FIREBASE_PROJECT_ID, // Often derived from serviceAccount, but good to be explicit
        // databaseURL: process.env.FIREBASE_DATABASE_URL, // If using Realtime DB/Firestore
    });
    console.log('Firebase Admin SDK Initialized Successfully.');
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error.message);
    // Check if the error is about serviceAccount path or content
    if (error.message.includes('Failed to parse service account')) {
        console.error("Ensure 'firebaseServiceAccountKey.json' is correctly placed and formatted.");
    }
    if (error.message.includes('storageBucket')) {
        console.error("Ensure 'FIREBASE_STORAGE_BUCKET' environment variable is set correctly in the backend environment.");
    }
    process.exit(1);
}

module.exports = admin;