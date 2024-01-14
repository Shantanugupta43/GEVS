import React, { useState, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../gevsapp.css';

// Register the required elements and scales
Chart.register(CategoryScale, LinearScale, BarElement, Legend);

const ElectionOfficerDashboard = () => {
  const [message, setMessage] = useState('');
  const [electionStatus, setElectionStatus] = useState('');
  const [electionResults, setElectionResults] = useState(null);
  const [refreshIntervalId, setRefreshIntervalId] = useState(null);
  const [winner, setWinner] = useState('');
  const [seats, setSeats] = useState([]);

  const fetchWinnerAndSeats = async () => {
    try {
      const response = await fetch('/gevs/results');
      if (response.ok) {
        const data = await response.json();
        setMessage(`Election status: ${data.status}`);
        setWinner(data.winner);
        setSeats(data.seats);
      } else {
        console.error('Failed to fetch winner and seats:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching winner and seats:', error.message);
    }
  };



  const fetchElectionResults = async () => {
    try {
      const response = await fetch('/api/election-results');
      if (response.ok) {
        const data = await response.json();
        setElectionResults(data.results);
      } else {
        console.error('Failed to fetch election results:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching election results:', error.message);
    }
  };

  const fetchElectionData = async () => {
    try {
      // Fetch election status
      const statusResponse = await fetch('/api/election-status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setElectionStatus(statusData.status);
        setMessage(`Election status: ${statusData.status}`);
      } else {
        console.error('Failed to fetch election status:', statusResponse.statusText);
      }

      // Fetch election results
      const resultsResponse = await fetch('/api/election-results');
      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json();
        setElectionResults(resultsData.results);
      } else {
        console.error('Failed to fetch election results:', resultsResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching election data:', error.message);
    }
  };

  const fetchElectionStatus = async () => {
    try {
      const response = await fetch('/api/election-status');
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
      const response = await fetch('/api/start-election', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage('Election started successfully');
        // Fetch election data initially
        fetchElectionData();
        // Set up interval to refresh data every 5 seconds
        setRefreshIntervalId(setInterval(fetchElectionData, 5000));
      } else {
        setMessage('Failed to start the election');
      }
    } catch (error) {
      console.error('Error starting election:', error.message);
    }
  };

  const endElection = async () => {
    try {
      const response = await fetch('/api/end-election', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage('Election ended successfully');
        // Clear the refresh interval
        clearInterval(refreshIntervalId);
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
    const fetchDataInterval = async () => {
      await fetchElectionData();
    };

    const intervalId = setInterval(fetchDataInterval, 5000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Run once on component mount

  useEffect(() => {
    // Fetch initial winner and seats when the component mounts
    fetchWinnerAndSeats();
    // Fetch initial election status when the component mounts
    fetchElectionStatus();
    fetchElectionResults();

    // Check if the election is started, and initiate the interval if true
    if (electionStatus === 'started') {
      const intervalId = setInterval(fetchElectionData, 5000);
      setRefreshIntervalId(intervalId);
    }
  }, [electionStatus]); // Re-run when election status changes

  const prepareChartData = () => {
    if (!electionResults) return null;

    const allCandidates = Array.from(
      new Set(electionResults.flatMap(result => result.candidates.map(candidate => candidate.candidate)))
    );

    const allParties = Array.from(
      new Set(electionResults.flatMap(result => result.candidates.map(candidate => candidate.party)))
    );

    const datasets = [];
    let maxVoteCount = 0;

    electionResults.forEach((result, index) => {
      const candidates = result.candidates;
      const dataset = {
        label: result.constituency,
        data: allCandidates.map(candidateName => {
          const matchingCandidate = candidates.find(candidate => candidate.candidate === candidateName);
          const voteCount = matchingCandidate ? matchingCandidate.vote_count : 0;
          maxVoteCount = Math.max(maxVoteCount, voteCount);
          return voteCount;
        }),
        backgroundColor: getFixedColor(index),
      };

      datasets.push(dataset);
    });

    // Calculate the suggestedMax based on the maximum vote count
    const suggestedMax = Math.ceil((maxVoteCount + 1) / 5) * 5;

    return { labels: allCandidates, datasets, suggestedMax, parties: allParties };
  };

  const fixedColors = [
    '#FF5733', // Color for the first constituency
    '#33FF57', // Color for the second constituency
    '#5733FF', // Color for the third constituency
    '#55157a',  // Color for the fourth constituency
    '#00FFEG', // Color for the fifth constituency
  ];

  const getFixedColor = (index) => {
    // Use modulo to cycle through colors if there are more constituencies than fixed colors
    return fixedColors[index % fixedColors.length];
  };

  return (
    <div className="layout">
      <h2>Election Officer Dashboard</h2>
      <button onClick={startElection} disabled={electionStatus === 'started'}>
        Start Election
      </button>
      <button onClick={endElection} disabled={electionStatus === 'ended'}>
        End Election
      </button>
      <p>{message}</p>

      {electionResults && (
        <div>
          <h3>Real-time Election Results</h3>
          <Bar className='Bar'
            data={prepareChartData()}
            options={{


              scales: {
                x: { type: 'category' },
                y: {
                  beginAtZero: true,
                  suggestedMax: prepareChartData().suggestedMax,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    generateLabels: (chart) => {
                      const datasets = chart.data.datasets;
                      if (!datasets) return []; // Ensure datasets is defined

                      const legendLabels = [];

                      datasets.forEach((dataset, index) => {
                        const label = dataset.label || '';
                        const backgroundColor = dataset.backgroundColor || '';
                        const voteCount = chart.data.voteCounts ? chart.data.voteCounts[index] : '';

                        legendLabels.push({
                          text: `${label} - ${voteCount}`,
                          fillStyle: backgroundColor,
                        });
                      });

                      return legendLabels;
                    },
                  },
                },
              },


            }}
          />
          <div>
            <h3>Candidates and Parties</h3>

            {winner && (
              <div>
                <h5>Election Winner</h5>
                <p>{`Winner: ${winner}`}</p>
              </div>
            )}

            {seats.length > 0 && (
              <div>
                <h5>Seats</h5>
                {seats.map(seat => (
                  <p key={seat.party}>{`${seat.party}: ${seat.seat}`}</p>
                ))}
              </div>
            )}

            {prepareChartData().parties.map(party => (
              <div key={party}>
                <h4>{party}</h4>
                <ul>
                  {electionResults.map(result => (
                    <li key={result.constituency}>
                      <strong>{result.constituency}</strong>:{' '}
                      {result.candidates
                        .filter(candidate => candidate.party === party)
                        .map(candidate => (
                          <span key={candidate.candidate}>
                            {`${candidate.candidate} (${candidate.party}) - ${candidate.vote_count} votes`}
                            <br />
                          </span>
                        ))}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display other election officer dashboard content */}
    </div>
  );
};

export default ElectionOfficerDashboard;
