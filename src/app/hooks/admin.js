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
