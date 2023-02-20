import { useEffect, useState } from 'react';
import { authFetch } from 'helpers/auth';
import { ApiBaseUrl } from '../constants';

export const useInstructorSections = () => {
  const [instructorSections, setInstructorSections] = useState([]);

  useEffect(() => {
    const getInstructorCourseNumbers = async () => {
      let sections = await authFetch(`${ApiBaseUrl}/api/sections`);
      sections = await sections.json();
      setInstructorSections(sections);
    };

    getInstructorCourseNumbers();
  }, []);

  return instructorSections;
};

export const useIsUserAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  const fetchIsAuth = async () => {
    await authFetch(`${ApiBaseUrl}/api/auth`, 'GET')
      .then(res => res.json())
      .then(res => {
        // console.log('RESPONSE', res);
        setIsAuth(true);
        setUser(res.user);
      })
      .catch(e => {
        setIsAuth(false);
        setUser();
      });
  };

  useEffect(() => {
    fetchIsAuth();
  }, []);

  // console.log('useIsUserAuth', isAuth, user);

  return [isAuth, user];
};
