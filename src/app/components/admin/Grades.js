import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Elevation } from '@blueprintjs/core';
import StyledCard from 'app-styled/StyledCard';
import { useInstructorSections } from 'hooks/admin';

const StyledTd = styled.td`
  width: 50px;
`;

const Grades = () => {
  const instructorSections = useInstructorSections();
  const [currentSectionId, setCurrentSectionId] = useState('');
  const [currentGrades, setCurrentGrades] = useState({});
  const [currentProblemsets, setCurrentProblemsets] = useState([]);

  const onChange = ({ target: { value } }) => {
    setCurrentSectionId(value);
  };

  const setCurrentSectionGrades = async () => {
    const grades = await fetch(
      `http://localhost:5000/api/sections/${currentSectionId}/grades`
    ).then(res => res.json());
    setCurrentGrades(grades);
  };

  const setCurrentProblemsetsHelper = async () => {
    const problemsets = await fetch(
      `http://localhost:5000/api/sections/${currentSectionId}/problemsets`
    ).then(res => res.json());
    setCurrentProblemsets(problemsets);
  };

  useEffect(() => {
    if (currentSectionId) {
      setCurrentSectionGrades();
      setCurrentProblemsetsHelper();
    }
  }, [currentSectionId]);

  useEffect(() => {
    if (instructorSections.length) {
      setCurrentSectionId(instructorSections[0].id);
    }
  }, [instructorSections]);

  useEffect(() => {
    console.log('currentGrades', currentGrades);
    console.log('currentProblemsets', currentProblemsets);
  });

  return (
    <div>
      <StyledCard elevation={Elevation.THREE}>
        <div>Select a course section:</div>
        <select value={currentSectionId} onChange={onChange} onBlur={onChange}>
          {instructorSections.map(section => (
            <option key={section.id} value={section.id}>
              {`${section.section_number}: ${section.term} ${section.year}`}
            </option>
          ))}
        </select>
      </StyledCard>
      <StyledCard elevation={Elevation.TWO}>
        <table>
          <thead>
            <th />
            {currentProblemsets.map(problemset => (
              <th key={problemset.id}>{problemset.order}</th>
            ))}
          </thead>
          <tbody>
            <tr />
            {Object.keys(currentGrades).map(userId => (
              <tr key={userId}>
                <StyledTd>{userId}</StyledTd>
                {currentProblemsets.map(problemset => (
                  <StyledTd key={problemset.id}>
                    {currentGrades[userId][problemset.id]}
                  </StyledTd>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </StyledCard>
    </div>
  );
};

export default Grades;
