import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { authFetch } from 'helpers/auth';
import CreateSection from './CreateSection';
import AdminHeader from './AdminHeader';
import Home from './Home';
import RosterContainer from './RosterContainer';
import Grades from './Grades';

const AdminContainer = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const getIsAdmin = async () => {
    const response = await authFetch(`${API_BASE_URL}/api/auth`);
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
      <Route exact path="/admin" component={Home} />
      <Route exact path="/admin/create" component={CreateSection} />
      <Route exact path="/admin/roster" component={RosterContainer} />
      <Route exact path="/admin/grades" component={Grades} />
    </>
  ) : (
    <div>LOADING...</div>
  );
};

export default AdminContainer;
