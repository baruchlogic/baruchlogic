import { useEffect, useState } from 'react';
import { authFetch } from 'helpers/auth';

export const useInstructorSections = () => {
  const [instructorSections, setInstructorSections] = useState([]);

  const getInstructorCourseNumbers = async () => {
    let sections = await authFetch(`${API_BASE_URL}/api/sections`);
    sections = await sections.json();
    console.log('SECTIONS', sections);
    setInstructorSections(sections);
  };

  useEffect(() => {
    getInstructorCourseNumbers();
  }, []);

  return instructorSections;
};
