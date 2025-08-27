
 const admin = require('./config/firebaseAdmin');

 // Paste the UID of the user you want to make a 'member'
 const memberUid = 'Dl8Oc2A0H9cLpYYx17SAchnWtBP2'; 

 admin.auth().setCustomUserClaims(memberUid, { role: 'member' }) // Set the role here
     .then(() => {
         console.log(`Successfully set 'member' role for user: ${memberUid}`);
         process.exit();
     })
     .catch(error => {
         console.error('Error setting custom claims:', error);
         process.exit(1);
     });
 