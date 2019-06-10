import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { authFetch } from '../helpers/auth';
import AdminHeader from './AdminHeader';
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

const AdminContainer = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const getIsAdmin = async () => {
    const response = await authFetch('http://localhost:5000/api/auth');
    if (response.status !== 200) {
      setIsAdmin(false);
      return;
    }
    const admin = await response.json();
    setIsAdmin(admin.admin);
  };
  useEffect(() => {
    getIsAdmin();
  });
  useEffect(() => {
    console.log('isAdmin', isAdmin);
  });

  return isAdmin === false ? (
    <Redirect to="/" />
  ) : isAdmin === true ? (
    <>
      <AdminHeader />
      <StyledCard>
        <StyledContainer elevation={Elevation.THREE}>
          <h2>Welcome to the baruchlogic admin dashboard!</h2>
          <h3>Here you can...</h3>
          <StyledUl>
            <li>Create and manage course sections;</li>
            <li>{"View your students' grades;"}</li>
            <li>Manage homework assignments and due dates</li>
          </StyledUl>
        </StyledContainer>
      </StyledCard>
    </>
  ) : (
    <div>LOADING...</div>
  );
};

export default AdminContainer;
