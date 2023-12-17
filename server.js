// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./src/components/db');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Salt rounds for bcrypt hashing
const saltRounds = 10;

app.get('/api/health', async (req, res) => {
  try {
    // Check the connection status
    await pool.getConnection();
    res.status(200).json({ message: 'Application is connected to Heroku' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Error connecting to Heroku' });
  }
});

// Endpoint for user registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, fullName, dateOfBirth, password, constituency, uvc } = req.body;

    // Check if the provided UVC code exists and is not used
    const [uvcRows, uvcFields] = await pool.execute(
      'SELECT * FROM uvc_code WHERE UVC = ? AND used IS NULL',
      [uvc]
    );

    if (uvcRows.length === 1) {
      // UVC code is valid, mark it as used
      await pool.execute('UPDATE uvc_code SET used = 1 WHERE UVC = ?', [uvc]);

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Proceed with voter registration
      const [rows, fields] = await pool.execute(
        'INSERT INTO voters (voter_id, full_name, DOB, password, constituency_id, UVC) VALUES (?, ?, ?, ?, ?, ?)',
        [email, fullName, dateOfBirth, hashedPassword, constituency, uvc]
      );

      res.status(201).json({ message: 'Registration successful' });
    } else {
      // Invalid UVC code
      res.status(400).json({ message: 'Invalid UVC code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint for user login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows, fields] = await pool.execute(
      'SELECT * FROM voters WHERE voter_id = ?',
      [email]
    );

    if (rows.length === 1) {
      // Compare the provided password with the hashed password in the database
      const match = await bcrypt.compare(password, rows[0].password);

      if (match) {
        // Successful login
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Endpoint for election officer dashboard
app.get('/api/election-officer-dashboard', async (req, res) => {
  try {
    // Add logic to fetch and return election data
    // This could include real-time results, winner information, etc.
    res.status(200).json({ message: 'Election Officer Dashboard Data' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
