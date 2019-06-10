import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import StyledCard from 'app-styled/StyledCard';
import { Elevation } from '@blueprintjs/core';

const StyledContainer = styled.div`
  text-align: center;
`;

const StyledUl = styled.ul`
  margin: auto;
  text-align: left;
  width: 50%;
`;

const AdminHome = () => (
  <StyledCard elevation={Elevation.THREE}>
    <StyledContainer>
      <h2>Welcome to the baruchlogic admin dashboard!</h2>
      <h3>Here you can...</h3>
      <StyledUl>
        <li>Create and manage course sections;</li>
        <li>{"View your students' grades;"}</li>
        <li>Manage homework assignments and due dates</li>
      </StyledUl>
      <br />
      <div>
        To get started, visit the <Link to="/admin/how-to">how-to</Link>{' '}
        section.
      </div>
    </StyledContainer>
  </StyledCard>
);

export default AdminHome;
