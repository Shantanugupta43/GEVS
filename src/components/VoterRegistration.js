// VoterRegistration.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

const VoterRegistration = () => {
  const navigate = useNavigate();

  const today = new Date();
  const maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    constituency: '',
    uvc: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [uvcError, setUvcError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [isCameraEnabled, setCameraEnabled] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTownChange = (e) => {
    const town = e.target.value;
    const constituencyId = getConstituencyIdByTown(town);
    setFormData({ ...formData, constituency: town, constituencyId });
  };

  const getConstituencyIdByTown = (town) => {
    switch (town) {
      case 'Shangri-la-Town':
        return 1;
      case 'Northern-Kunlun-Mountain':
        return 2;
      case 'Western-Shangri-la':
        return 3;
      case 'Naboo-Vallery':
        return 4;
      case 'New-Felucia':
        return 5;
      default:
        return null;
    }
  };

  useEffect(() => {
    console.log('Updated UVC:', formData.uvc);
  }, [formData.uvc]);

  const handleEnableCamera = () => {
    setCameraEnabled(true);
  };

  const handleDisableCamera = () => {
    setCameraEnabled(false);
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

    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Password and Confirm Password do not match.');
      return;
    } else {
      setPasswordError('');
    }

    try {


      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Registration successful');

        // Navigate to the login page after successful registration
        navigate('/login');
        alert('Registration successful! Login again to start voting.')
      } else {
        console.error('Registration failed:', response.statusText);
        if (response.status === 400) {
          const responseData = await response.json();
          if (responseData.message === 'Invalid UVC code or already used') {
            setUvcError('Invalid UVC code or already used. Please check your information.');
          } else if (responseData.message === 'Email is already linked to another registered voter') {
            setEmailError('Email is already linked to another registered voter');
          } else {
            setUvcError('UVC validation failed. Please check your information.');
          }

          // Check if it's a UVC error and handle accordingly
          if (responseData.uvcError) {
            setUvcError('Invalid UVC code or already used. Please check your information.');
          }
        } else {
          alert('Registration failed. Please check your information.');
        }
      }
    } catch (error) {
      console.error('Error during registration:', error.message);
    }
  };

  return (
    <div className="layout">
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
          {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
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
            max={maxDOB.toISOString().split('T')[0]}
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
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        </div>
        <div>
          <label htmlFor="constituency">Constituency:</label>
          <select
            id="constituency"
            name="constituency"
            value={formData.constituency}
            onChange={(e) => {
              handleTownChange(e);
            }}
            required
          >
            <option value="">Select Town</option>
            <option value="Shangri-la-Town">Shangri-la-Town</option>
            <option value="Northern-Kunlun-Mountain">Northern-Kunlun-Mountain</option>
            <option value="Western-Shangri-la">Western-Shangri-la</option>
            <option value="Naboo-Vallery">Naboo-Vallery</option>
            <option value="New-Felucia">New-Felucia</option>
          </select>
        </div>

        <div>
          <label htmlFor="uvc">Unique Voter Code (UVC):</label>
          <input
            type="text"
            id="uvc"
            name="uvc"
            value={formData.uvc}
            onChange={handleChange}
            required
          />
          {uvcError && <p style={{ color: 'red' }}>{uvcError}</p>}
          {isCameraEnabled && (
            <QrReader delay={200} onResult={onResult} style={{ width: '30%' }} />
          )}
        </div>

        <button type="button" onClick={handleEnableCamera}>
          Enable Camera
        </button>
        <button type="button" onClick={handleDisableCamera}>
            Disable Camera
        </button>
        <button type="submit">Register</button>
      </form>

      <p>
        Already registered? <Link to="/login" className="snippetlogin">Login here</Link>
      </p>
    </div>
  );
};

export default VoterRegistration;
