import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@blueprintjs/core';

import { Colors } from "@blueprintjs/core";

const Header = () => (
  <Navbar
    className="app-header bp3-dark"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
  >
    <Link to="/" className="app-header__link">home</Link>
    <Link to="/about" className="app-header__link">about</Link>
    <Link to="/text" className="app-header__link">text</Link>
    <Link to="/videos" className="app-header__link">videos</Link>
    <Link to="/exercises" className="app-header__link">exercises</Link>
    <Link to="/homework" className="app-header__link">homework</Link>
  </Navbar>
);

export default Header;
