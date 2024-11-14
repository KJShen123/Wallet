const express = require('express');
const { loginUser } = require('./function');  // Import the loginUser function
const router = express.Router();  // Use Router to define the routes

// POST /js/function - Login route
router.post('/js/function', async (req, res) => {
    const { email, password } = req.body;
    const loginResponse = await loginUser(email, password);  // Use the loginUser function
    
    if (loginResponse.success) {
        // Store AccountID in the session
        req.session.accountID = loginResponse.accountID;  // Set the session with AccountID

        res.json({ success: true });
    } else {
        res.status(401).json({ message: loginResponse.message });
    }
});

// Session check route to check if the user is logged in
router.get('/session-check', (req, res) => {
    if (req.session.accountID) {
        // If session exists, user is authenticated
        console.log("User ID from session: ", req.session.accountID); // Print the ID to the console
        res.json({ success: true });
    } else {
        // If session does not exist, user is not authenticated
        console.log("No user logged in"); // Print that no user is logged in
        res.json({ success: false, message: 'Not authenticated' });
    }
});


module.exports = router;
