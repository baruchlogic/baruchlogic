import React, { useEffect, useState } from 'react';
import { Parser } from 'json2csv';
import { Elevation } from '@blueprintjs/core';
import StyledCard from 'app-styled/StyledCard';
import { number } from 'prop-types';
import { authFetch } from 'helpers/auth';
import {
  getValueFromLocalStorageByKey,
  saveToLocalStorage
} from 'helpers/localStorage';

const Roster = ({ sectionId, sectionNumber }) => {
  const [students, setStudents] = useState([]);
  const [studentNames, setStudentNames] = useState({});

  const getStudentsInSection = async sectionId => {
    const users = await fetch(
      `${API_BASE_URL}/api/sections/${sectionId}/users`
    ).then(res => res.json());
    setStudents(users);
  };

  useEffect(() => {
    getStudentsInSection(sectionId);
  }, [sectionId]);

  useEffect(() => {
    hydrateStudentNames();
  }, [students]);

  useEffect(() => {
    saveToLocalStorage('studentNames', studentNames);
    // console.log('studentNames', studentNames);
  }, [studentNames]);

  const onAddStudent = async () => {
    let newStudentKey = await authFetch(`${API_BASE_URL}/api/users`, 'POST', {
      body: JSON.stringify({ sectionId })
    });
    newStudentKey = await newStudentKey.text();
    // console.log('NEW STUDENT KEY', newStudentKey);
    getStudentsInSection(sectionId);
  };

  const onNameInputChange = e => {
    const {
      target: {
        dataset: { key },
        value
      }
    } = e;
    // console.log('onNameInputChange', key, value);
    setStudentNames({
      ...studentNames,
      [key]: value
    });
  };

  const hydrateStudentNames = () => {
    // console.log('hydrateStudentNames');
    const localStudentNames = getValueFromLocalStorageByKey('studentNames');
    // console.log('localStudentNames', localStudentNames);
    setStudentNames(localStudentNames);
  };

  const onDownloadCSV = () => {
    // console.log('onDownloadCSV');
    try {
      const parser = new Parser({ fields: Object.keys(studentNames) });
      const csv = parser.parse(studentNames);
      // console.log(csv);

      const hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
      hiddenElement.target = '_blank';
      hiddenElement.download = `roster-${sectionNumber}.csv`;
      hiddenElement.click();
    } catch (err) {
      console.error(err);
    }
  };

  const onRemoveUser = async userId => {
    // console.log('onRemoveUser', userId);
    const res = await authFetch(
      `${API_BASE_URL}/api/sections/${sectionId}/users/${userId}`,
      'DELETE'
    );
    // console.log('res', res);
    if (res.status === 200) {
      setStudents(students.filter(student => student.id !== userId));
    }
  };

  return (
    <StyledCard elevation={Elevation.TWO}>
      <h2>ROSTER</h2>
      <div>
        <button onClick={onAddStudent}>Add student to roster</button>
      </div>
      <ul style={{ maxWidth: '350px', margin: 'auto' }}>
        {students.map(student => (
          <li
            key={student.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '1rem 0'
            }}
          >
            <button
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onRemoveUser(student.id);
              }}
            >
              X
            </button>
            <div>{student.key}</div>
            <input
              data-key={student.key}
              onChange={onNameInputChange}
              value={(studentNames && studentNames[student.key]) || ''}
            />
          </li>
        ))}
      </ul>
      <br />
      <button onClick={onDownloadCSV}>Download .csv</button>
    </StyledCard>
  );
};

Roster.propTypes = {
  sectionId: number,
  sectionNumber: number
};

export default Roster;
