import React, { useState, useEffect } from 'react';
import { Elevation } from '@blueprintjs/core';
import { authFetch } from 'helpers/auth';
import { useIsUserAuth } from '../hooks/admin';

import StyledCard from 'app-styled/StyledCard';
import { ApiBaseUrl } from '../constants';

const Grades = () => {
  const [grades, setGrades] = useState();
  const [sectionProblemsets, setSectionProblemsets] = useState();
  const [isAuth] = useIsUserAuth();
  const [average, setAverage] = useState();

  console.log('GRADES', grades);
  console.log('SECTION PROBLEMSETS', sectionProblemsets);

  useEffect(() => {
    if (isAuth) {
      const getGrades = async () => {
        const grades = await authFetch(
          `${ApiBaseUrl}/api/user/grades`
        ).then(res => res.json());
        setGrades(grades);
        const problemsets = await authFetch(
          `${ApiBaseUrl}/api/user/sections/problemsets`
        ).then(res => res.json());
        problemsets.sort((a, b) => a.problemset_order - b.problemset_order);
        setSectionProblemsets(problemsets);
      };
      getGrades();
    }
  }, [isAuth]);

  useEffect(() => {
    if (sectionProblemsets && grades) {
      const totalScore = grades.reduce((acc, el) => acc + el.score, 0);
      const totalPossible = sectionProblemsets.length * 100;
      setAverage(Number((totalScore / totalPossible) * 100).toPrecision(2));
    }
  }, [sectionProblemsets, grades]);

  return (
    <StyledCard elevation={Elevation.THREE}>
      {isAuth ? (
        <>
          <h1>Your grades for this section:</h1>
          <table
            style={{
              border: '1px solid black',
              borderCollapse: 'collapse',
              margin: 'auto'
            }}
          >
            <thead>
              <tr>
                <th>Problemset #</th>
                {(sectionProblemsets || []).map(pset => (
                  <th
                    key={pset.id}
                    style={{
                      border: '1px solid black',
                      borderCollapse: 'collapse'
                    }}
                  >
                    {pset.problemset_order}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Score</td>
                {(sectionProblemsets || []).map(pset => {
                  const grade = (grades || []).find(
                    x => x.problemset_id === pset.id
                  );
                  return (
                    <td
                      key={pset.id}
                      style={{
                        border: '1px solid black',
                        borderCollapse: 'collapse'
                      }}
                    >
                      {grade ? grade.score : 0}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
          <div>
            <h2>Average:</h2>
            <h3>{average}</h3>
          </div>
        </>
      ) : (
        <h2>Please log in to view grades.</h2>
      )}
    </StyledCard>
  );
};

export default Grades;
