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

app.get("/*", function (req, res) {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

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


app.get('/api/election-results', async (req, res) => {
  try {
    const [constituencyRows, constituencyFields] = await pool.execute('SELECT * FROM constituency');

    const results = [];

    for (const constituency of constituencyRows) {
      const [candidateRows, candidateFields] = await pool.execute(
        'SELECT candidate.canid, candidate.candidate, party.party, candidate.vote_count FROM candidate JOIN party ON candidate.party_id = party.party_id WHERE candidate.constituency_id = ? ORDER BY candidate.canid', // Add ORDER BY clause
        [constituency.constituency_id]
      );

      const constituencyResult = {
        constituency: constituency.constituency_name,
        candidates: candidateRows,
      };

      results.push(constituencyResult);
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/api/election-status', async (req, res) => {
  try {
    const result = await pool.query('SELECT election_status FROM election_status WHERE id = 1');


    if (result && result[0] && result[0][0] && 'election_status' in result[0][0]) {
      const electionStatus = result[0][0].election_status;

      if (electionStatus == 0) {
        res.status(200).json({ status: 'not-started' });
      } else if (electionStatus == 1) {
        res.status(200).json({ status: 'started' });
      } else if (electionStatus == 2) {
        res.status(200).json({ status: 'ended' });
      }
    } else {
      console.error('Unexpected query result format or missing data.');
      res.status(200).json({ status: 'not-started' });
    }
  } catch (error) {
    console.error('Error executing the query:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




// Endpoint to start the election
// Endpoint to start the election
// Endpoint to start the election
app.post('/api/start-election', async (req, res) => {
  try {
    // Implement the logic to start the election
    // Update the 'election_status' in the 'election_status' table to 1 (started)
    await pool.query('UPDATE election_status SET election_status = 1 WHERE id = 1');

    res.status(200).json({ message: 'Election started successfully', status: 'started' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Endpoint to end the election
app.post('/api/end-election', async (req, res) => {
  try {
    // Implement the logic to end the election
    // Update the 'election_status' in the 'election_status' table to 2 (ended)
    await pool.query('UPDATE election_status SET election_status = 2 WHERE id = 1');

    res.status(200).json({ message: 'Election ended successfully', status: 'ended' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



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
        const token = jwt.sign({ user: rows[0] }, secretKey, { expiresIn: '40m' });
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

app.get('/api/chosen-details', authenticateUser, async (req, res) => {
  try {
    if (req.user && req.user.voter_id) {
      const [chosenDetailsRows, chosenDetailsFields] = await pool.execute(
        'SELECT candidate.candidate AS chosenCandidate, party.party AS chosenParty FROM voters ' +
        'LEFT JOIN candidate ON voters.chosen_candidate = candidate.canid ' +
        'LEFT JOIN party ON candidate.party_id = party.party_id ' +
        'WHERE voters.voter_id = ?',
        [req.user.voter_id]
      );

      if (chosenDetailsRows.length === 1) {
        const { chosenCandidate, chosenParty } = chosenDetailsRows[0];

        // Include user and token in the response for demonstration purposes
        res.status(200).json({ chosenCandidate, chosenParty, user: req.user, token: req.token });
      } else {
        res.status(404).json({ message: 'Chosen details not found' });
      }
    } else {
      console.error('User is not authenticated or missing voter_id');
      res.status(401).json({ message: 'User not authenticated or missing voter_id' });
    }
  } catch (error) {
    console.error('Error in /api/chosen-details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Endpoint to submit a vote
app.post('/api/submit-vote/:candidateId', authenticateUser, async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Check if the user has already voted
    if (req.user && req.user.voter_id && req.user.vote === 1) {
      return res.status(400).json({ message: 'User has already voted' });
    }

    const [candidateRows, candidateFields] = await pool.execute(
      'SELECT candidate.candidate, party.party FROM candidate JOIN party ON candidate.party_id = party.party_id WHERE candidate.canid = ?',
      [candidateId]
    );

    if (candidateRows.length === 1) {
      const chosenCandidate = candidateRows[0].candidate;
      const chosenParty = candidateRows[0].party;

      // Update the candidate's vote count
      await pool.execute('UPDATE `candidate` SET `vote_count` = `vote_count` + 1 WHERE `canid` = ?', [candidateId]);

      if (req.user && req.user.voter_id) {
        // Update `voters` table with vote information and chosen details
        await pool.execute(
          'UPDATE `voters` SET `vote` = 1, `chosen_candidate` = ?, `chosen_party` = ? WHERE `voter_id` = ?',
          [chosenCandidate, chosenParty, req.user.voter_id]
        );

        // Fetch updated voter details after the vote is submitted
        const [updatedVoterRows, updatedVoterFields] = await pool.execute(
          'SELECT * FROM voters WHERE voter_id = ?',
          [req.user.voter_id]
        );

        if (updatedVoterRows.length === 1) {
          const updatedVoter = updatedVoterRows[0];
          // Include user and token in the response for demonstration purposes
          return res.status(200).json({
            message: 'Vote submitted successfully',
            updatedVoter,
            chosenCandidate,
            chosenParty,
            user: req.user,
            token: req.token,
          });
        } else {
          console.error('Error fetching updated voter details after vote submission');
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      } else {
        console.error('User is not authenticated or missing voter_id');
        return res.status(401).json({ message: 'User not authenticated or missing voter_id' });
      }
    } else {
      // Candidate not found
      console.error('Candidate details not found for candidateId:', candidateId);
      return res.status(404).json({ message: 'Candidate details not found' });
    }
  } catch (error) {
    console.error('Error in /api/submit-vote:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});





app.set('json spaces', 2);

app.get('/gevs/constituency/:constituencyName', async (req, res) => {
  try {
    const { constituencyName } = req.params;
    
    // Fetch the constituency data based on the provided name
    const [constituencyRows, constituencyFields] = await pool.execute(
      'SELECT candidate.candidate, party.party, candidate.vote_count FROM candidate JOIN party ON candidate.party_id = party.party_id JOIN constituency ON candidate.constituency_id = constituency.constituency_id WHERE constituency.constituency_name = ?',
      [constituencyName]
    );

    if (constituencyRows.length > 0) {
      // Prepare the response JSON
      const responseJson = {
        constituency: constituencyName,
        result: constituencyRows.map(candidate => ({
          name: candidate.candidate,
          party: candidate.party,
          vote: candidate.vote_count,
        })),
      };

      // Send the response
      res.status(200).json(responseJson, null, 2);
    } else {
      // Constituency not found
      res.status(404).json({ message: 'Constituency not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/gevs/results', async (req, res) => {
  try {
    // Fetch constituency results
    const [constituencyRows, constituencyFields] = await pool.execute('SELECT * FROM constituency');
    const results = [];

    for (const constituency of constituencyRows) {
      const [candidateRows, candidateFields] = await pool.execute(
        'SELECT candidate.canid, candidate.candidate, party.party, candidate.vote_count FROM candidate JOIN party ON candidate.party_id = party.party_id WHERE candidate.constituency_id = ? ORDER BY candidate.vote_count DESC',
        [constituency.constituency_id]
      );

      const constituencyResult = {
        constituency: constituency.constituency_name,
        candidates: candidateRows,
      };

      results.push(constituencyResult);
    }

    // Fetch election status
    const electionStatusResult = await pool.query('SELECT election_status FROM election_status WHERE id = 1');
    const electionStatus = electionStatusResult[0][0].election_status;

    let responseStatus = 'Pending';
    let winner = 'Pending';
    let seats = [];

    const totalSeats = 5; // Assuming there are 5 seats in total
    const parties = Array.from(new Set(results.flatMap(result => result.candidates.map(candidate => candidate.party))));

    seats = parties.map(party => ({
      party: party,
      seat: results.reduce((total, result) => {
        const partyResult = result.candidates.find(candidate => candidate.party === party);
        return total + (partyResult && partyResult.vote_count > 0 ? 1 : 0); // Award 1 seat if the party has votes in the constituency
      }, 0),
    }));

    if (electionStatus === 2) {
      // Election has ended
      responseStatus = 'Completed';

      // Find the winning party
      const totalSeatsWon = seats.reduce((total, party) => total + party.seat, 0);
// Before the if statement
console.log('Total Seats Won:', totalSeatsWon);
console.log('Total Seats:', totalSeats);

const halfTotalSeats = Math.ceil(totalSeats / 2);
console.log('Half of Total Seats Calculation:', halfTotalSeats);

const partiesWithoutMajority = seats.filter(party => party.seat < halfTotalSeats);

if (partiesWithoutMajority.length === seats.length) {
  // No party secured an overall majority
  console.log('Inside if statement');
  winner = 'Hung Parliament';
} else {
  // Winner party gains an overall majority
  console.log('Inside else statement');
  winner = seats.reduce((max, party) => (party.seat > max.seat ? party : max), seats[0]).party;
console.log('Winner:', winner);
}
    }




    res.status(200).json({ status: responseStatus, winner, seats });
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
