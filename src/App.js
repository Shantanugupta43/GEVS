// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoterRegistration from './components/VoterRegistration';
import VoterLogin from './components/VoterLogin';
import VoterDashboard from './components/VoterDashboard';
import ElectionOfficerDashboard from './components/ElectionOfficerDashboard';
import OfficerLogin from './components/OfficerLogin';
import AlreadyVoted from './components/alreadyVoted';
import Navbar from './components/Navbar';
import Success from './components/Success';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<VoterRegistration />} />
        <Route path="/login" element={<VoterLogin />} />
        <Route path="/voter-dashboard" element={<VoterDashboard/>} />
        <Route path="/election-officer-dashboard" element={<ElectionOfficerDashboard />} />
        <Route path="/officer-login" element={<OfficerLogin />} />
        <Route path= "/alreadyVoted" element={<AlreadyVoted />} />
        <Route path= "/success" element={<Success />} />

      </Routes>
    </Router>
  );
};

export default App;
