import React, { useEffect, useState } from 'react';
import StyledCard from 'app-styled/StyledCard';
import { number } from 'prop-types';

/**
 * Roster of student keys for a given section
 * @param {string} sectionId
 * @return {React.Component}
 */
const Roster = ({ sectionId }) => {
  const [studentKeys, setStudentKeys] = useState([]);
  const getStudentKeysForSectionId = async sectionId => {
    console.log('getStudentKeysForSectionId');
    let keys = await fetch(
      `http://localhost:5000/api/sections/${sectionId}/roster`
    );
    console.log('keys', keys);
    keys = await keys.json();
    console.log('keys2', keys);
    setStudentKeys(keys);
  };
  useEffect(() => {
    getStudentKeysForSectionId(sectionId);
  }, [sectionId]);
  return (
    <StyledCard studentKeys={studentKeys}>
      <h2>ROSTER</h2>
      <ul>
        {studentKeys.map(key => (
          <li key={key}>{key}</li>
        ))}
      </ul>
    </StyledCard>
  );
};

Roster.propTypes = {
  sectionId: number
};

export default Roster;
