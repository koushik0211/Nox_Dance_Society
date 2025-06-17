const express = require('express');
const router = express.Router();

// There is no login controller if you are using Firebase client-side auth.
// The purpose of this route might be different in a Firebase setup,
// for example, to create a user profile in your own DB after they've signed up via Firebase.
// Or, if you did want a backend login flow (less common with Firebase Auth),
// you would import the controller like this:
// const { loginUser } = require('../controllers/authController');

// For now, let's create a placeholder route so the file exists and can be required.
// You can build this out later if needed.
router.get('/', (req, res) => {
    res.send('Auth route is active');
});

// If you did implement a backend login controller:
// router.post('/login', loginUser);

module.exports = router;