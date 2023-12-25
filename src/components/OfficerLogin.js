// OfficerLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OfficerLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            admin_email: formData.email, 
            password: formData.password,
          }),
      });

      if (response.ok) {
        console.log('Admin login successful');
        navigate('/election-officer-dashboard');
      } else {
        console.error('Admin login failed:', response.statusText);
        if (response.status === 401) {
          setError('Incorrect email or password');
        } else {
          setError('Login failed. Please check your information.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div>
      <h2>Officer Login</h2>

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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>


    </div>
  );
};

export default OfficerLogin;
