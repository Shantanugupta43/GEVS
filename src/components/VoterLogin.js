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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();

        // Extract the token and user information from the response
        const { token, user } = responseData;

        // Save the token to localStorage
        localStorage.setItem('jwtToken', token);

        // Check if the user has already voted
        if (user.vote === 1) {
          // User has already voted, redirect to a page indicating that
          navigate('/alreadyVoted');
        } else {
          // User has not voted, redirect to the dashboard
          navigate('/voter-dashboard', { state: { selectedConstituency: user.constituency_name, user } });
        }
      } else {
        console.error('Login failed:', response.statusText);
        if (response.status === 401) {
          alert('Incorrect email or password. Please try again.');
        } else {
          alert('Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div className="layout">
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
