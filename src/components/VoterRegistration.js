import React, { useState } from 'react';
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

  const onResult = (result) => {
    setFormData({ ...formData, uvc: result?.text || '' });
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleEnableCamera = () => {
    setCameraEnabled(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Handle registration logic here (send data to the server, etc.)
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
          <input
            type="text"
            id="uvc"
            name="uvc"
            value={formData.uvc}
            required
          />
          {/* QR Code Scanner */}
          {isCameraEnabled && (
            <QrReader delay={200} onError={handleError} onScan={onResult} style={{ width: '100%' }} />
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
