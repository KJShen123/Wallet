const express = require('express');
const sql = require('mssql');
const dbConfig = require('./dbconfig');
const { loginUser } = require('./function'); 
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

// Route to fetch user data based on session's AccountID
router.get('/getUserData', async (req, res) => {
    try {
        // Ensure the user is logged in
        if (!req.session || !req.session.accountID) {
            return res.status(401).json({ error: "User not logged in" });
        }

        let pool = await sql.connect(dbConfig);
        const accountID = req.session.accountID;

        // Create a request object
        const request = pool.request();

        // Bind parameters for SQL query
        request.input('accountID', sql.Int, accountID);

        // Fetch data from multiple tables with named parameters
        const user = await request.query("SELECT * FROM Profile WHERE AccountID = @accountID");
        const certifications = await request.query("SELECT * FROM Certification WHERE AccountID = @accountID");
        const educations = await request.query("SELECT * FROM Education WHERE AccountID = @accountID");
        const softSkills = await request.query("SELECT * FROM SoftSkill WHERE AccountID = @accountID");
        const works = await request.query("SELECT * FROM Work WHERE AccountID = @accountID");

        // Return all data
        res.json({ 
            user: user.recordset, 
            certifications: certifications.recordset, 
            educations: educations.recordset, 
            softSkills: softSkills.recordset, 
            works: works.recordset 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching data" });
    }
});

module.exports = router;
