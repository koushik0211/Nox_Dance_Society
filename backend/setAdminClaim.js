// backend/setAdminClaim.js
const admin = require('./config/firebaseAdmin');

// Paste the UID of your admin user here (from the Firebase Auth console)
const adminUid = 'teiPr8nEhoeEDNs8k7U1OE5AaA93'; 

admin.auth().setCustomUserClaims(adminUid, { admin: true })
    .then(() => {
        console.log(`Successfully set admin claim for user: ${adminUid}`);
        process.exit();
    })
    .catch(error => {
        console.error('Error setting custom claims:', error);
        process.exit(1);
    });