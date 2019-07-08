import { useEffect, useState } from 'react';
import { authFetch } from 'helpers/auth';

export const useInstructorSections = () => {
  const [instructorSections, setInstructorSections] = useState([]);

  const getInstructorCourseNumbers = async () => {
    let sections = await authFetch(`http://localhost:5000/api/sections`);
    sections = await sections.json();
    console.log('SECTIONS', sections);
    setInstructorSections(sections);
  };

  useEffect(() => {
    getInstructorCourseNumbers();
  }, []);

  return instructorSections;
};

export const useIsUserAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  const fetchIsAuth = async () => {
    await authFetch('http://localhost:5000/api/auth', 'GET')
      .then(res => res.json())
      .then(res => {
        console.log('RESPONSE', res);
        setIsAuth(true);
        setUser(res.user);
      });
  };

  useEffect(() => {
    fetchIsAuth();
  }, []);

  console.log('useIsUserAuth', isAuth, user);

  return [isAuth, user];
};
