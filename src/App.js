// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoterRegistration from './components/VoterRegistration';
import VoterLogin from './components/VoterLogin';
import VoterDashboard from './components/VoterDashboard';
import ElectionOfficerDashboard from './components/ElectionOfficerDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VoterLogin />} />
        <Route path="/register" element={<VoterRegistration />} />
        <Route path="/dashboard" element={<VoterDashboard />} />
        <Route path="/election-officer-dashboard" element={<ElectionOfficerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
