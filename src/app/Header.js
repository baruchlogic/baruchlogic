import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <div>
    <Link to="/about">about</Link>
    <Link to="/text">text</Link>
    <Link to="/videos">videos</Link>
    <Link to="/exercises">exercises</Link>
    <Link to="/homework">homework</Link>
  </div>
);

export default Header;
