import React, { useEffect, useState } from 'react';
import StyledCard from 'app-styled/StyledCard';
import { number } from 'prop-types';
import { authFetch } from '../helpers/auth';

const saveToLocalStorage = (key, value) => {
  const jsonValue = JSON.stringify(value);
  localStorage.setItem(key, jsonValue);
};

const clearKeyFromLocalStorage = key => {
  localStorage.removeItem(key);
};

/**
 * Roster of student keys for a given section
 * @param {string} sectionId
 * @return {React.Component}
 */
const Roster = ({ sectionId }) => {
  const [studentKeys, setStudentKeys] = useState([]);
  const [studentNames, setStudentNames] = useState({});

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

  useEffect(() => {
    saveToLocalStorage('studentNames', studentNames);
    console.log('studentNames', studentNames);
  }, [studentNames]);

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

  const onAddName = e => {
    const {
      target: {
        dataset: { key },
        value
      }
    } = e;
    console.log('onAddName', key, value);
    setStudentNames({
      ...studentNames,
      [key]: value
    });
  };

  return (
    <StyledCard>
      <h2>ROSTER</h2>
      <div>
        <button onClick={onAddStudent}>Add student to roster</button>
      </div>
      <ul>
        {studentKeys.map(key => (
          <li key={key}>
            <div>{key}</div>
            <input data-key={key} onChange={onAddName}/>
          </li>
        ))}
      </ul>
    </StyledCard>
  );
};

Roster.propTypes = {
  sectionId: number
};

export default Roster;
