import React, { useEffect, useState } from 'react';
import StyledCard from 'app-styled/StyledCard';
import { Elevation } from '@blueprintjs/core';
import { useInstructorSections } from 'hooks/admin';
import Roster from './Roster';

/**
 * Container for list of student rosters.
 * @return {React.Component}
 */
const RosterContainer = () => {
  const instructorSections = useInstructorSections();
  const [currentSection, setCurrentSection] = useState({});
  const [inputCourseNumber, setInputCourseNumber] = useState();
  useEffect(() => {
    if (instructorSections.length) {
      setCurrentSection(instructorSections[0]);
      setInputCourseNumber(instructorSections[0].section_number);
    }
  }, [instructorSections]);
  useEffect(() => {
    // console.log('inputCourseNumber', inputCourseNumber);
    const section = instructorSections.find(
      section => section.section_number == inputCourseNumber
    );
    setCurrentSection(section);
  }, [inputCourseNumber]);
  useEffect(() => {
    // console.log('currentSection', currentSection);
    // console.log('instructorSections', instructorSections);
  });
  // console.log('currentSection', currentSection);
  return (
    <div>
      <StyledCard elevation={Elevation.THREE}>
        <div>Manage the rosters for your course sections.</div>
        <div>Select your course section below:</div>
        <div>
          <select
            value={inputCourseNumber}
            onBlur={e => {
              setInputCourseNumber(Number(e.target.value));
            }}
            onChange={e => {
              setInputCourseNumber(Number(e.target.value));
            }}
          >
            {instructorSections.map(section => (
              <option
                key={`${section.section_number}-${section.term}-${
                  section.year
                }`}
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
      {currentSection && currentSection.id && (
        <Roster
          sectionId={Number(currentSection.id)}
          sectionNumber={currentSection.section_number}
        />
      )}
    </div>
  );
};

export default RosterContainer;
