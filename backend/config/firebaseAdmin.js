// backend/config/firebaseAdmin.js
const admin = require('firebase-admin');

let serviceAccount;

// This logic allows the app to work both locally and when deployed.
// Vercel (and other platforms) will have the FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable set.
if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
        console.log("Initializing Firebase Admin with BASE64 environment variable...");
        // Decode the base64 encoded key from the environment variable
        const decodedKey = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
        serviceAccount = JSON.parse(decodedKey);
    } catch (e) {
        console.error("CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64. Ensure it's a valid Base64 encoded JSON string.", e);
        process.exit(1);
    }
} else {
    // For local development, use the local file.
    // Make sure this file exists in /config and is in your .gitignore!
    try {
        console.log("Initializing Firebase Admin with local service account file...");
        serviceAccount = require('./firebaseServiceAccountKey.json');
    } catch (e) {
         console.error("CRITICAL: Local 'firebaseServiceAccountKey.json' not found or invalid. This file is required for local development.");
         process.exit(1);
    }
}

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // These environment variables also need to be set on Vercel
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET, 
        projectId: process.env.FIREBASE_PROJECT_ID,
    });
    console.log('Firebase Admin SDK Initialized Successfully.');
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error.message);
    if (error.message.includes('storageBucket')) {
        console.error("Ensure 'FIREBASE_STORAGE_BUCKET' environment variable is set on Vercel.");
    }
    process.exit(1);
}

module.exports = admin;