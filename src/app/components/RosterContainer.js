import React, { useEffect, useState } from 'react';
import StyledCard from 'app-styled/StyledCard';
import { Elevation } from '@blueprintjs/core';
import { authFetch } from '../helpers/auth';

/**
 * Container for list of student rosters.
 * @return {React.Component}
 */
const RosterContainer = () => {
  const [currentSection, setCurrentSection] = useState({});
  const [instructorSections, setInstructorSections] = useState([]);
  const [inputCourseNumber, setInputCourseNumber] = useState();
  const getInstructorCourseNumbers = async () => {
    let sections = await authFetch(`http://localhost:5000/api/sections`);
    sections = await sections.json();
    console.log('SECTIONS', sections);
    setInstructorSections(sections);
    setCurrentSection(sections[0]);
    setInputCourseNumber(sections[0].section_number);
  };
  useEffect(() => {
    getInstructorCourseNumbers();
  }, []);
  useEffect(() => {
    console.log('inputCourseNumber', inputCourseNumber);
    const section = instructorSections.find(
      section => section.section_number == inputCourseNumber
    );
    setCurrentSection(section);
  }, [inputCourseNumber]);
  useEffect(() => {
    console.log('currentSection', currentSection);
    console.log('instructorSections', instructorSections);
  });
  console.log('currentSection', currentSection);
  return (
    <StyledCard elevation={Elevation.THREE}>
      <div>Manage the rosters for your course sections.</div>
      <div>Select your course section below:</div>
      <div>
        <select
          value={inputCourseNumber}
          onBlur={e => {
            setInputCourseNumber(e.target.value);
          }}
          onChange={e => {
            setInputCourseNumber(e.target.value);
          }}
        >
          {instructorSections.map(section => (
            <option
              key={section.section_number}
              value={section.section_number}
              selected={
                currentSection &&
                currentSection.section_number === section.section_number
              }
            >
              {`${section.section_number}: ${section.term} ${section.year}`}
            </option>
          ))}
        </select>
      </div>
    </StyledCard>
  );
};

export default RosterContainer;
