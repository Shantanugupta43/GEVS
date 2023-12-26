import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const VoterDashboard = () => {
  const location = useLocation();
  const [candidates, setCandidates] = useState([]);

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
                </li>
              ))}
            </ul>
          ) : (
            <p>No candidates available for the selected constituency.</p>
          )}
        </div>
      ) : (
        <p>Please register and select a constituency to view candidates.</p>
      )}
    </div>
  );
};

export default VoterDashboard;
