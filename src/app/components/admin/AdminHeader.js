import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Navbar } from '@blueprintjs/core';
import { Icon } from '@blueprintjs/core';

const StyledNavbar = styled(Navbar)`
  &&& {
    background-color: #2d0f4c;
    display: flex;
    align-items: center;
    height: 4rem;
    justify-content: space-between;
    padding: 0 4rem;
    @media (max-width: 750px) {
      flex-direction: column;
      height: auto;
    }
  }
`;

const StyledLink = styled(Link)`
  &&& {
    color: white;
    font-size: 1.5rem;
    transition: color 0.1s linear;
    &:hover {
      color: #669eff;
      text-decoration: none;
    }
  }
`;

const StyledUserIcon = styled(Icon)`
  &&& {
    color: white;
    cursor: pointer;
    transition: color 0.1s linear;
    &:hover {
      color: #669eff;
    }
  }
`;

const StyledDivider = styled(Navbar.Divider)`
  @media (max-width: 750px) {
    transform: rotateZ(90deg);
  }
`;

const StyledHomeIcon = styled.i`
  color: white;
  font-size: 2rem;
  margin-right: 1rem;
  transition: color 0.1s linear;
  &:hover {
    color: #669eff;
  }
`;

const StyledFlexDiv = styled.div`
  align-items: center;
  display: flex;
  justify: center;
`;

const AdminHeader = () => (
  <StyledNavbar>
    <StyledFlexDiv>
      <Link to="/">
        <StyledHomeIcon className="fas fa-home" />
      </Link>
      <StyledLink to="/admin">admin dashboard</StyledLink>
    </StyledFlexDiv>
    <StyledDivider />
    <StyledLink to="/admin/how-to">how-to</StyledLink>
    <StyledLink to="/admin/roster">roster</StyledLink>
    <StyledLink to="/admin/create">create section</StyledLink>
    <StyledLink to="/admin/grades">grades</StyledLink>
    <StyledLink to="/admin/settings">course settings</StyledLink>
    <Navbar.Group>
      <Link to="/login">
        <StyledUserIcon icon="user" iconSize={32} />
      </Link>
    </Navbar.Group>
  </StyledNavbar>
);

export default AdminHeader;
