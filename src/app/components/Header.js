import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Navbar } from '@blueprintjs/core';
import { Icon } from '@blueprintjs/core';

const StyledNavbar = styled(Navbar)`
  background-color: #2d0f4c !important;
  display: flex;
  align-items: center;
  height: 4rem !important;
  justify-content: space-between;
  padding: 0 4rem !important;
  @media (max-width: 750px) {
    flex-direction: column;
    height: auto !important;
  }
`;

const StyledLink = styled(Link)`
  color: white !important;
  font-size: 1.5rem !important;
  transition: color 0.1s linear;
  &:hover {
    color: #669eff !important;
    text-decoration: none;
  }
`;

const StyledUserIcon = styled(Icon)`
  color: white !important;
  cursor: pointer;
  transition: color 0.1s linear;
  &:hover {
    color: #669eff !important;
  }
`;

const StyledDivider = styled(Navbar.Divider)`
  @media (max-width: 750px) {
    transform: rotateZ(90deg);
  }
`;

const Header = () => (
  <StyledNavbar>
    <StyledLink to="/">home</StyledLink>
    <StyledLink to="/about">about</StyledLink>
    <StyledLink to="/text">text</StyledLink>
    <StyledLink to="/videos">videos</StyledLink>
    <StyledLink to="/exercises">exercises</StyledLink>
    <StyledLink to="/homework">homework</StyledLink>
    <StyledDivider />
    <Navbar.Group>
      <Link to="/login">
        <StyledUserIcon icon="user" iconSize={32} />
      </Link>
    </Navbar.Group>
  </StyledNavbar>
);

export default Header;
