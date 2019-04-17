import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@blueprintjs/core';

import { Colors } from "@blueprintjs/core";

const headerStyles = {
  display: 'flex',
  alignItems: 'center',
  height: '5rem',
  justifyContent: 'space-between'
};

const LinkStyle = {
  color: 'white'
};

const Header = () => (
  <Navbar
    className="app-header bp3-dark"
    style={headerStyles}
  >
    <Link to="/" style={LinkStyle}>home</Link>
    <Link to="/about" style={LinkStyle}>about</Link>
    <Link to="/text" style={LinkStyle}>text</Link>
    <Link to="/videos" style={LinkStyle}>videos</Link>
    <Link to="/exercises" style={LinkStyle}>exercises</Link>
    <Link to="/homework" style={LinkStyle}>homework</Link>
  </Navbar>
);

export default Header;
