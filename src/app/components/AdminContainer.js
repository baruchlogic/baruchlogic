import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { authFetch } from '../helpers/auth';
import AdminHeader from './AdminHeader';

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
    <AdminHeader />

  ) : (
    <div>LOADING...</div>
  );
};

export default AdminContainer;
