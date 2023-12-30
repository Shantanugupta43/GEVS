import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const VoterDashboard = () => {
  const location = useLocation();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Retrieve the selected constituency from the location state
  const selectedConstituency = location.state?.selectedConstituency;

  useEffect(() => {
    if (selectedConstituency) {
      // Fetch candidates based on the selected constituency
      fetch(`http://localhost:3001/api/candidates/${selectedConstituency}`)
        .then((response) => response.json())
        .then((data) => {
          setCandidates(data.candidates);
        })
        .catch((error) => {
          console.error('Error fetching candidates:', error);
        });
    }
  }, [selectedConstituency]);


  const submitVote = () => {
    // Implement logic to submit the vote
    // Update the candidate's vote_count and mark the voter as having voted
    // Use an API endpoint to update the database
    if (selectedCandidate) {
      // Call an API to submit the vote and handle the logic on the server
      fetch(`http://localhost:3001/api/submit-vote/${selectedCandidate.canid}`, {
        method: 'POST',
        // Add headers and other configurations as needed
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response, update the UI, etc.
          console.log('Vote submitted successfully');
        })
        .catch((error) => {
          console.error('Error submitting vote:', error);
        });
    }
  };

  return (
    <div>
      <h2>Voter Dashboard</h2>
      {selectedConstituency ? (
        <div>
          <h3>Candidates for {selectedConstituency}</h3>
          {candidates.length > 0 ? (
            <ul>
              {candidates.map((candidate) => (
                <li key={candidate.canid}>
                  {candidate.candidate} - {candidate.party}
                  <button onClick={() => setSelectedCandidate(candidate)}>Vote</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No candidates available for the selected constituency.</p>
          )}

          {selectedCandidate && (
            <div>
              <p>Selected Candidate: {selectedCandidate.candidate}</p>
              <button onClick={submitVote}>Submit Vote</button>
            </div>
          )}
        </div>
      ) : (
        <p>Please register and select a constituency to view candidates.</p>
      )}
    </div>
  );
};

export default VoterDashboard;
