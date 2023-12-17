import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

const VoterRegistration = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    dateOfBirth: '',
    password: '',
    constituency: '',
    uvc: '',
  });

  const [isCameraEnabled, setCameraEnabled] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Handle asynchronous updates to the uvc state, if needed
    console.log('Updated UVC:', formData.uvc);
  }, [formData.uvc]);

  const handleEnableCamera = () => {
    setCameraEnabled(true);
  };

  const onResult = (result, error) => {
    if (!!error) {
      console.info(error);
    } else {
      console.log('Scanned QR Code:', result?.text);
      setFormData({ ...formData, uvc: result?.text || '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting Form Data:', formData);

      // Send registration data to the server
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registration successful
        console.log('Registration successful');
      } else {
        // Registration failed
        console.error('Registration failed:', response.statusText);
        // show an error message to the user
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
      // Handle other errors (network issues, etc.)
    }
  };

  return (
    <div>
      <h2>Voter Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="constituency">Constituency:</label>
          <input
            type="text"
            id="constituency"
            name="constituency"
            value={formData.constituency}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="uvc">Unique Voter Code (UVC):</label>
          <input type="text" id="uvc" name="uvc" value={formData.uvc} required />

          {/* QR Code Scanner */}
          {isCameraEnabled && (
            <QrReader delay={200} onResult={onResult} style={{ width: '100%' }} />
          )}
        </div>

        <button type="button" onClick={handleEnableCamera}>
          Enable Camera
        </button>
        <button type="submit">Register</button>
      </form>

      <p>
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default VoterRegistration;
