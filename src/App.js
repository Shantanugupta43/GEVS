// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoterRegistration from './components/VoterRegistration';
import VoterLogin from './components/VoterLogin';
import VoterDashboard from './components/VoterDashboard';
import ElectionOfficerDashboard from './components/ElectionOfficerDashboard';
import OfficerLogin from './components/OfficerLogin';
import AlreadyVoted from './components/alreadyVoted';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VoterRegistration />} />
        <Route path="/login" element={<VoterLogin />} />
        <Route path="/voter-dashboard" element={<VoterDashboard/>} />
        <Route path="/election-officer-dashboard" element={<ElectionOfficerDashboard />} />
        <Route path="/officer-login" element={<OfficerLogin />} />
        <Route path= "/alreadyVoted" element={<AlreadyVoted />} />
      </Routes>
    </Router>
  );
};

export default App;
