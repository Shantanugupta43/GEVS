import React, { useState, useEffect } from 'react';

const ElectionOfficerDashboard = () => {
  const [message, setMessage] = useState('');
  const [electionStatus, setElectionStatus] = useState('');

  const fetchElectionStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/election-status');
      if (response.ok) {
        const data = await response.json();
        setElectionStatus(data.status);
        setMessage(`Election status: ${data.status}`);
      } else {
        console.error('Failed to fetch election status:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching election status:', error.message);
    }
  };

  const startElection = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/start-election', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage('Election started successfully');
        // Introduce a delay before fetching the updated election status
        setTimeout(fetchElectionStatus, 2000); // Adjust the delay as needed
      } else {
        setMessage('Failed to start the election');
      }
    } catch (error) {
      console.error('Error starting election:', error.message);
    }
  };

  const endElection = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/end-election', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage('Election ended successfully');
        // Introduce a delay before fetching the updated election status
        setTimeout(fetchElectionStatus, 2000); // Adjust the delay as needed
      } else {
        setMessage('Failed to end the election');
      }
    } catch (error) {
      console.error('Error ending election:', error.message);
    }
  };

  useEffect(() => {
    // Fetch initial election status when the component mounts
    fetchElectionStatus();
  }, []);

  return (
    <div>
      <h2>Election Officer Dashboard</h2>
      <button onClick={startElection} disabled={electionStatus === 'started'}>
        Start Election
      </button>
      <button onClick={endElection} disabled={electionStatus === 'ended'}>
        End Election
      </button>
      <p>{message}</p>
      {/* Display other election officer dashboard content */}
    </div>
  );
};

export default ElectionOfficerDashboard;
