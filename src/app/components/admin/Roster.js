import React, { useEffect, useState } from 'react';
import { Parser } from 'json2csv';
import StyledCard from 'app-styled/StyledCard';
import { number } from 'prop-types';
import { authFetch } from 'helpers/auth';
import {
  getValueFromLocalStorageByKey,
  saveToLocalStorage
} from 'helpers/localStorage';

const Roster = ({ sectionId, sectionNumber }) => {
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
    hydrateStudentNames();
  }, [studentKeys]);

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

  const hydrateStudentNames = () => {
    console.log('hydrateStudentNames');
    const localStudentNames = getValueFromLocalStorageByKey('studentNames');
    console.log('localStudentNames', localStudentNames);
    setStudentNames(localStudentNames);
  };

  const onDownloadCSV = () => {
    console.log('onDownloadCSV');
    try {
      const parser = new Parser({ fields: Object.keys(studentNames) });
      const csv = parser.parse(studentNames);
      console.log(csv);

      const hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
      hiddenElement.target = '_blank';
      hiddenElement.download = `roster-${sectionNumber}.csv`;
      hiddenElement.click();
    } catch (err) {
      console.error(err);
    }
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
            <input
              data-key={key}
              onChange={onAddName}
              value={(studentNames && studentNames[key]) || ''}
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
