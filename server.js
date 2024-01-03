// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./src/components/db');
const authenticateUser = require('./src/components/authenticationMiddleware');
const jwt = require('jsonwebtoken');

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
    res.status(200).json({ message: 'Application is connected to MySQL database' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Error connecting to MYSQL' });
  }
});

// Endpoint for user registration
// Endpoint for user registration
// Endpoint for user registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, fullName, dateOfBirth, password, confirmPassword, constituency, uvc } = req.body;

    // Check if the email exists in the voters table
    const [emailCheckRows, emailCheckFields] = await pool.execute(
      'SELECT * FROM voters WHERE voter_id = ?',
      [email]
    );

    if (emailCheckRows.length > 0) {
      // Email is already used
      return res.status(400).json({ message: 'Email is already linked to another registered voter' });
    }

    const [uvcRows, uvcFields] = await pool.execute(
      'SELECT * FROM uvc_code WHERE UVC = ? AND used = 0',
      [uvc]
    );

    if (uvcRows.length === 1) {
      // UVC code is valid, mark it as used
      await pool.execute('UPDATE uvc_code SET used = 1 WHERE UVC = ?', [uvc]);

      // Check if the provided constituency name exists in the database
      const [constituencyRows, constituencyFields] = await pool.execute(
        'SELECT constituency_id FROM constituency WHERE constituency_name = ?',
        [constituency]
      );

      if (constituencyRows.length === 1) {
        // Constituency is valid, proceed with voter registration
        const constituencyId = constituencyRows[0].constituency_id;

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Proceed with voter registration
        await pool.execute(
          'INSERT INTO voters (voter_id, full_name, DOB, password, constituency_id, UVC) VALUES (?, ?, ?, ?, ?, ?)',
          [email, fullName, dateOfBirth, hashedPassword, constituencyId, uvc]
        );

        return res.status(201).json({ message: 'Registration successful' });
      } else {
        // Invalid constituency
        return res.status(400).json({ message: 'Invalid constituency' });
      }
    } else {
      // Invalid UVC code or already used
      return res.status(400).json({ message: 'Invalid UVC code or already used', uvcError: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows, fields] = await pool.execute(
      'SELECT voters.*, constituency.constituency_name FROM voters JOIN constituency ON voters.constituency_id = constituency.constituency_id WHERE voter_id = ?',
      [email]
    );

    if (rows.length === 1) {
      // Compare the provided password with the hashed password in the database
      const match = await bcrypt.compare(password, rows[0].password);

      if (match) {
        // Successful login
        // Generate JWT token and send it in the response
        const secretKey = process.env.SECRET_KEY; // Use the environment variable for the secret key
        const token = jwt.sign({ user: rows[0] }, secretKey, { expiresIn: '5m' });
        console.log('Server gen token',token)

        res.status(200).json({ message: 'Login successful', user: rows[0], token });
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

app.post('/api/adminlogin', async (req, res) => {
  try {
    const { admin_email, password } = req.body;

    console.log('Parameter values:', admin_email, password);

    // Check if the email exists in the admin table
    const [adminRows, adminFields] = await pool.execute(
      'SELECT * FROM admin WHERE admin_email = ?',
      [admin_email]
    );

    if (adminRows.length === 1) {
      // Admin email exists, compare hashed passwords
      const hashedPassword = adminRows[0].password;

      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Passwords match, admin login successful
        res.status(200).json({ message: 'Admin login successful' });
      } else {
        // Incorrect password
        res.status(401).json({ message: 'Incorrect email or password' });
      }
    } else {
      // Admin email does not exist
      res.status(401).json({ message: 'Incorrect email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/api/candidates', async (req, res) => {
  try {
    const [candidateRows, candidateFields] = await pool.query(
      'SELECT candidate.canid, candidate.candidate, party.party FROM candidate JOIN party ON candidate.party_id = party.party_id'
    );
    res.status(200).json({ candidates: candidateRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/api/candidates/:constituency', async (req, res) => {
  try {
    const { constituency } = req.params;
    const [rows, fields] = await pool.execute(
      'SELECT candidate.canid, candidate.candidate, party.party FROM candidate JOIN party ON candidate.party_id = party.party_id WHERE candidate.constituency_id = (SELECT constituency_id FROM constituency WHERE constituency_name = ?) AND candidate.elected = 0',
      [constituency]
    );

    res.status(200).json({ candidates: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Existing route
app.post('/api/submit-vote/:candidateId', authenticateUser, async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Example SQL queries to update candidate and mark the voter as having voted
    await pool.execute('UPDATE `candidate` SET `vote_count` = `vote_count` + 1, `elected` = 1 WHERE `canid` = ?', [candidateId]);

    // Update the voter's table to mark them as having voted
    if (req.user && req.user.voter_id) {
      await pool.execute('UPDATE `voters` SET `vote` = 1 WHERE `voter_id` = ?', [req.user.voter_id]);
    } else {
      console.error('User is not authenticated or missing voter_id');
      return res.status(401).json({ message: 'User not authenticated or missing voter_id' });
    }

    res.status(200).json({ message: 'Vote submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});






app.get('/api/constituency/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows, fields] = await pool.execute(
      'SELECT constituency_name FROM constituency WHERE constituency_id = ?',
      [id]
    );

    if (rows.length === 1) {
      res.status(200).json({ constituency_name: rows[0].constituency_name });
    } else {
      res.status(404).json({ message: 'Constituency not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
