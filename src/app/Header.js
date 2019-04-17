import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@blueprintjs/core';

import { Colors } from "@blueprintjs/core";

const Header = () => (
  <Navbar
    className="bp3-dark"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
  >
    <Link to="/">home</Link>
    <Link to="/about">about</Link>
    <Link to="/text">text</Link>
    <Link to="/videos">videos</Link>
    <Link to="/exercises">exercises</Link>
    <Link to="/homework">homework</Link>
  </Navbar>
);

export default Header;
