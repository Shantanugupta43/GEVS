import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Disable the ability to go back during the countdown
    const disableBack = () => {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        window.history.go(1);
      };
    };

    // Update the countdown every second
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Add a timeout to navigate to the login page after 5 seconds (5000 milliseconds)
    const timeoutId = setTimeout(() => {
      navigate('/login');
    }, 5000);

    disableBack();

    // Clear the interval and timeout on component unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      window.onpopstate = null;
    };
  }, [navigate]);

  return (
    <div className="layout">
      <h2>Good News! Your vote has been successfully submitted!</h2>
      <p>Thanks for your participation!</p>
      <p>You will be redirected to the login page in {countdown} seconds...</p>
    </div>
  );
};

export default Success;