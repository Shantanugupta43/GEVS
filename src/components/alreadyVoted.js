import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AlreadyVoted = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [chosenCandidate, setChosenCandidate] = useState('');
  const [chosenParty, setChosenParty] = useState('');

  useEffect(() => {
    const fetchChosenDetails = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken');

        if (!jwtToken) {
          console.error('JWT token not found.');
          // Redirect to login page or handle unauthorized access
          navigate('/login');
          return;
        }

        const response = await fetch('https://gevs-9fedf25d0d77.herokuapp.com/api/chosen-details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          const { chosen_candidate, chosen_party } = responseData.user;
          setChosenCandidate(chosen_candidate || '');
          setChosenParty(chosen_party || '');
          startCountdown();
        } else {
          console.error('Error fetching chosen details:', response.statusText);
          // Redirect to login page or handle unauthorized access
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching chosen details:', error.message);
        // Redirect to login page or handle unauthorized access
        navigate('/login');
      }
    };

    const startCountdown = () => {
      let currentCount = 5;

      const timer = setInterval(() => {
        setCountdown(currentCount);
        currentCount--;

        if (currentCount < 0) {
          clearInterval(timer);
          navigate('/login'); // Replace '/dashboard' with the desired redirect path
        }
      }, 1000);
    };

    fetchChosenDetails();
  }, [navigate]);

  return (
    <div className="layout">
      <h2>You have already voted!</h2>
      <p>
        Chosen Candidate: {chosenCandidate}
        <br />
        Chosen Party: {chosenParty}
      </p>
      <p>Redirecting in {countdown} seconds...</p>
    </div>
  );
};

export default AlreadyVoted;
