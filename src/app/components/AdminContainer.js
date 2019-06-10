import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { authFetch } from '../helpers/auth';
import AdminCreate from './AdminCreate';
import AdminHeader from './AdminHeader';
import AdminHome from './AdminHome';

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
      <Route exact path="/admin" component={AdminHome} />
      <Route exact path="/admin/create" component={AdminCreate} />
    </>
  ) : (
    <div>LOADING...</div>
  );
};

export default AdminContainer;
