import React, { useEffect, useState } from 'react';
import StyledCard from 'app-styled/StyledCard';
import { number } from 'prop-types';
import { authFetch } from '../helpers/auth';

/**
 * Roster of student keys for a given section
 * @param {string} sectionId
 * @return {React.Component}
 */
const Roster = ({ sectionId }) => {
  const [studentKeys, setStudentKeys] = useState([]);
  const getStudentKeysForSectionId = async sectionId => {
    let keys = await fetch(
      `http://localhost:5000/api/sections/${sectionId}/roster`
    );
    keys = await keys.json();
    setStudentKeys(keys);
  };

  useEffect(() => {
    getStudentKeysForSectionId(sectionId);
  }, [sectionId]);

  const onAddStudent = async () => {
    let newStudentKey = await authFetch(
      `http://localhost:5000/api/user`,
      'POST',
      { body: JSON.stringify({ action: 'CREATE', sectionId }) }
    );
    newStudentKey = await newStudentKey.text();
    console.log('NEW STUDENT KEY', newStudentKey);
    getStudentKeysForSectionId(sectionId);
  };

  return (
    <StyledCard>
      <h2>ROSTER</h2>
      <div>
        <button onClick={onAddStudent}>Add student to roster</button>
      </div>
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
