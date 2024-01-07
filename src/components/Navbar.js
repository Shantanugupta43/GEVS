import React from 'react';
import { Link } from 'react-router-dom';
import '../gevsapp.css';
import gevslogo from '../image/gevslogo.png';

const Navbar = () => {
  return (
    <nav>
        <img src={gevslogo} alt="GEVS Logo" />
      <ul className="navcomponents">
        <li><Link to="/">Voter Registration</Link></li>
        <li><Link to="/login">Voter Login</Link></li>
        <li><Link to="/officer-login">Officer Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
