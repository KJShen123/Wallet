const bcrypt = require('bcrypt');
const sql = require('mssql');
const dbConfig = require('./dbconfig');

async function loginUser(email, password) {
    if (!email || !password) {
        return { success: false, message: 'Email and password are required' };
    }

    try {
        // Establish a connection to the database
        let pool = await sql.connect(dbConfig);

        // Query the database to get the hashed password and AccountID for the given email
        let result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT AccountID, Password FROM Account WHERE Email = @email');

        if (result.recordset.length === 0) {
            return { success: false, message: 'User not found' };
        }

        const hashedPassword = result.recordset[0].Password;
        const accountID = result.recordset[0].AccountID;  // Get the AccountID from the result

        // Compare input password with hashed password from the database
        const match = await bcrypt.compare(password, hashedPassword);

        if (match) {
            return { success: true, message: 'Login successful', accountID: accountID }; // Return AccountID
        } else {
            return { success: false, message: 'Incorrect password' };
        }
    } catch (err) {
        console.error("Error during login:", err);
        return { success: false, message: 'Login error' };
    }
}

module.exports = { loginUser };
