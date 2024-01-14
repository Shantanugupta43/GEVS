// components/VoterDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VoterDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [electionStatus, setElectionStatus] = useState('');

  const selectedConstituency = location.state?.selectedConstituency;

  // Define fetchCandidates using useCallback
  const fetchCandidates = useCallback(() => {
    if (selectedConstituency) {
      fetch(`/api/candidates/${selectedConstituency}`)
        .then((response) => response.json())
        .then((data) => {
          setCandidates(data.candidates);
        })
        .catch((error) => {
          console.error('Error fetching candidates:', error);
        });
    }
  }, [selectedConstituency]);

  const fetchElectionStatus = useCallback(() => {
    fetch('/api/election-status')
      .then((response) => response.json())
      .then((data) => {
        setElectionStatus(data.status);
      })
      .catch((error) => {
        console.error('Error fetching election status:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch election status when the component mounts
    fetchElectionStatus();

    // Fetch candidates when the component mounts
    fetchCandidates();
  }, [fetchCandidates, fetchElectionStatus]);

  const submitVote = () => {
    if (voteSubmitted) {
      console.log('You have already voted.');
      return;
    }

    const token = localStorage.getItem('jwtToken');


    if (!token) {
      // Token not found, user is not authenticated
      console.log('User not authenticated. Please log in.');
      // You can redirect to the login page or show an appropriate message
      return;
    }

    if (selectedCandidate) {
      fetch(`/api/submit-vote/${selectedCandidate.canid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log('Response Status:', response.status);
          if (response.status === 401) {
            // Token expired, show alert and prevent the vote
            window.alert('Session has expired. Please log in again.');
            localStorage.removeItem('jwtToken'); // Remove the expired token
            window.location.href = '/login'; // Redirect to the login page
            return Promise.reject('Unauthorized');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Vote submitted successfully');
          setVoteSubmitted(true);

          navigate('/success');

        })
        .catch((error) => {
          console.error('Error submitting vote:', error.message);
        });
    }
  };

  return (
    <div className="layout">
      <h2>Voter Dashboard</h2>
      {electionStatus === 'not-started' && (
        <p>Election has not started yet. Please wait for the election officer to start the election.</p>
      )}

      {electionStatus === 'started' && selectedConstituency && (
        <div>
          <h3>Candidates for {selectedConstituency}</h3>
          {candidates.length > 0 ? (
            <ul>
              {candidates.map((candidate) => (
                <li key={candidate.canid}>
                  {candidate.candidate} - {candidate.party}
                  <button onClick={() => setSelectedCandidate(candidate)} disabled={voteSubmitted}>
                    Vote
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No candidates available for the selected constituency.</p>
          )}

          {selectedCandidate && (
            <div>
              <p>Selected Candidate: {selectedCandidate.candidate}</p>
              <button onClick={submitVote} disabled={voteSubmitted}>
                Submit Vote
              </button>
            </div>
          )}
        </div>
      )}

      {electionStatus === 'ended' && <p>Election has ended. Voting is closed.</p>}

      {!selectedConstituency && <p>Please register and select a constituency to view candidates.</p>}
    </div>
  );
};

export default VoterDashboard;
