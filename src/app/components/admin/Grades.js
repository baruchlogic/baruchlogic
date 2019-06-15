import React from 'react';
// import styled from 'styled-components';
import { Elevation } from '@blueprintjs/core';
import StyledCard from 'app-styled/StyledCard';
import { useInstructorSections } from 'hooks/admin';

const Grades = () => {
  const instructorSections = useInstructorSections();
  return (
    <StyledCard elevation={Elevation.TWO}>
      <div>Select a course section:</div>
      <select>
        {instructorSections.map(section => (
          <option key={section.id} value={section.id}>
            {section.sectionNumber}
          </option>
        ))}
      </select>
    </StyledCard>
  );
};

export default Grades;
