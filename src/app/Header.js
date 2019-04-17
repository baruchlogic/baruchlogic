import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Navbar } from '@blueprintjs/core';
import { Icon, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

const StyledNavbar = styled(Navbar)`
  display: flex;
  align-items: center;
  height: 4rem !important;
  justify-content: space-between;
  padding: 0 4rem !important;
`;

const LinkStyle = {
  color: 'white',
  fontSize: '1.5rem'
};

const Header = () => (
  <StyledNavbar className="bp3-dark">
    <Link to="/" style={LinkStyle}>home</Link>
    <Link to="/about" style={LinkStyle}>about</Link>
    <Link to="/text" style={LinkStyle}>text</Link>
    <Link to="/videos" style={LinkStyle}>videos</Link>
    <Link to="/exercises" style={LinkStyle}>exercises</Link>
    <Link to="/homework" style={LinkStyle}>homework</Link>
     <Navbar.Divider />
     <Navbar.Group>
      <Icon icon="user" iconSize={32} />
     </Navbar.Group>
  </StyledNavbar>
);

export default Header;
