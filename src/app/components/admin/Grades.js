import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Elevation } from '@blueprintjs/core';
import StyledCard from 'app-styled/StyledCard';
import { useInstructorSections } from 'hooks/admin';
import { authFetch } from 'helpers/auth';
import { ApiBaseUrl } from '../../constants';

const StyledTd = styled.td`
  min-width: 50px;
`;

const StyledTh = styled.th`
  padding: 0 12px;
  max-width: 50px;
`;

const StyledInput = styled.input`
  border: 0;
  font-size: 24px;
  text-align: center;
  max-width: 50px;
  :focus {
    outline: none;
  }
`;

const Grades = () => {
  const instructorSections = useInstructorSections();
  const [currentSection, setCurrentSection] = useState({});
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentGrades, setCurrentGrades] = useState({});
  const [currentProblemsets, setCurrentProblemsets] = useState([]);
  const [studentNames, setStudentNames] = useState({});
  const [cellIsBeingEdited, setCellIsBeingEdited] = useState([]);
  const [tempVal, setTempVal] = useState();

  let localStorageNames = {};
  try {
    const names = localStorage.getItem('studentNames');
    if (names) {
      localStorageNames = JSON.parse(names);
    }
  } catch (e) {}

  const onSectionChange = ({ target: { value } }) => {
    setCurrentSectionId(Number(value));
  };

  const setCurrentSectionGrades = async () => {
    const grades = await fetch(
      `${ApiBaseUrl}/api/sections/${currentSectionId}/grades`
    ).then(res => res.json());
    console.log('GRADEs', grades);
    setCurrentGrades(grades);
  };

  const setCurrentProblemsetsHelper = async () => {
    const problemsets = await fetch(
      `${ApiBaseUrl}/api/sections/${currentSectionId}/problemsets`
    ).then(res => res.json());
    setCurrentProblemsets(
      problemsets.sort((a, b) =>
        a.default_order < b.default_order
          ? -1
          : a.default_order > b.default_order
          ? 1
          : 0
      )
    );
  };

  useEffect(() => {
    if (currentSectionId) {
      setCurrentSectionGrades();
      setCurrentProblemsetsHelper();
      const section = instructorSections.find(x => x.id === currentSectionId);
      setCurrentSection(section);
    }
  }, [currentSectionId]);

  useEffect(() => {
    if (instructorSections.length) {
      setCurrentSectionId(instructorSections[0].id);
    }
  }, [instructorSections]);

  useEffect(() => {
    const newStudentNames = {};
    Object.keys(currentGrades).forEach(studentId => {
      const name = localStorageNames[studentId];
      newStudentNames[studentId] = name;
    });
    setStudentNames(newStudentNames);
  }, [currentGrades]);

  const onDownloadCSV = () => {
    try {
      const row1 = ` ,${currentProblemsets
        .map(problemset => problemset.order)
        .join(',')}
        `;

      const body =
        row1 +
        Object.keys(currentGrades).map(
          userId =>
            `${localStorageNames[userId] || userId},${currentProblemsets
              .map(problemset => currentGrades[userId][problemset.id])
              .join(',')}`
        ).join(`
          `);
      // console.log(body);

      const hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(body);
      hiddenElement.target = '_blank';
      hiddenElement.download = `grades-${currentSection.section_number}.csv`;
      hiddenElement.click();
    } catch (err) {
      console.error(err);
    }
  };

  const setUpdatedScoreVal = async (userId, problemsetId, score) => {
    console.log('setUpdatedScoreVal', userId, problemsetId, score);
    await authFetch(
      `${ApiBaseUrl}/api/sections/
      ${currentSectionId}/grades/${problemsetId}/${userId}`,
      'POST',
      {
        body: JSON.stringify({ score })
      }
    );
  };

  const updateTempVal = e => {
    const val = Number(e.target.value);
    if (!Number.isInteger(val) || val < 0 || val > 100) {
      return;
    }
    setTempVal(val);
  };

  console.log('currentGrades', currentGrades);
  console.log('cellIsBeingEdited', cellIsBeingEdited);
  console.log('tempVal', tempVal);

  return (
    <div>
      <StyledCard elevation={Elevation.THREE}>
        <div>Select a course section:</div>
        <select
          value={currentSectionId}
          onChange={onSectionChange}
          onBlur={onSectionChange}
        >
          {instructorSections.map(section => (
            <option key={section.id} value={section.id}>
              {`${section.section_number}: ${section.term} ${section.year}`}
            </option>
          ))}
        </select>
      </StyledCard>
      <StyledCard elevation={Elevation.TWO} scroll>
        <table>
          <thead>
            <tr>
              <StyledTh />
              {currentProblemsets.map(problemset => (
                <StyledTh key={problemset.id}>
                  HW {problemset.default_order}
                </StyledTh>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr />
            {Object.keys(currentGrades).map((userId, row) => (
              <tr key={userId}>
                <StyledTd>
                  <pre>{studentNames[userId] || userId}</pre>
                </StyledTd>
                {currentProblemsets.map((problemset, col) => {
                  const isEditing =
                    row === cellIsBeingEdited[0] &&
                    col === cellIsBeingEdited[1];
                  if (isEditing) {
                    console.log('isEditing', row, col);
                  }
                  return (
                    <td
                      key={problemset.id}
                      onDoubleClick={() => {
                        setTempVal(currentGrades[userId][problemset.id] || 0);
                        setCellIsBeingEdited([row, col]);
                      }}
                    >
                      <StyledInput
                        defaultValue={currentGrades[userId][problemset.id] || 0}
                        value={
                          isEditing
                            ? tempVal
                            : currentGrades[userId][problemset.id] || 0
                        }
                        onChange={updateTempVal}
                        readOnly={!isEditing}
                        onBlur={async e => {
                          await setUpdatedScoreVal(
                            userId,
                            problemset.id,
                            e.target.value
                          );
                          await setCurrentSectionGrades();
                          setCellIsBeingEdited([]);
                          setTempVal();
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button onClick={onDownloadCSV}>Download .csv</button>
        </div>
      </StyledCard>
    </div>
  );
};

export default Grades;
