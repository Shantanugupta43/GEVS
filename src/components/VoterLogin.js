// components/VoterLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VoterLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login data to the server for validation
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Login successful
        console.log('Login successful');
        // Redirect to VoterDashboard upon successful login
        navigate('/voter-dashboard');
      } else {
        // Login failed
        console.error('Login failed:', response.statusText);
        if (response.status === 401) {
          // Unauthorized - Incorrect email or password
          alert('Incorrect email or password. Please try again.');
        } else {
          // Other login errors
          alert('Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      // Handle other errors (network issues, etc.)
    }
  };

  return (
    <div>
      <h2>Voter Login</h2>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default VoterLogin;
