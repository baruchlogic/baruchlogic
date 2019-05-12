import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';

import ProblemsetContainer from './ProblemsetContainer';
import StyledSidebar from 'app-styled/StyledSidebar';

const StyledContainer = styled.div`
  display: flex;
`;

const ProblemsetsContainer = ({
  match: {
    params: { id: problemsetId }
  }
}) => {
  const [groupedProblemsets, setGroupedProblemsets] = useState([]);
  const [fetchIsLoading, setFetchIsLoading] = useState(true);

  const fetchProblemSets = async () => {
    const response = await fetch('http://localhost:5000/api/problemsets').then(
      res => res.json()
    );
    setFetchIsLoading(false);
    const problemsets = response;
    const groupedProblemsets = groupProblemSetsByUnit(problemsets);
    setGroupedProblemsets(groupedProblemsets);
  };

  const groupProblemSetsByUnit = problemsets => {
    let maxUnit = 0;
    for (const problemset of problemsets) {
      maxUnit = Math.max(maxUnit, problemset.unit);
    }
    const result = new Array(maxUnit).fill(0).map(x => []);
    for (const problemset of problemsets) {
      result[problemset.unit - 1].push(problemset);
    }
    for (const set of result) {
      set.sort((a, b) => a.index_in_unit - b.index_in_unit);
    }
    return result;
  };

  useEffect(() => {
    fetchProblemSets();
  }, []);

  const mapProblemSetToJSX = problemset => (
    <li key={problemset.id}>
      <Link to={`/problemsets/${problemset.id}`}>
        <div>
          <span className="numbering">
            Problemset #{problemset.index_in_unit}
          </span>
        </div>
      </Link>
    </li>
  );

  return fetchIsLoading ? null : (
    <>
      <StyledContainer>
        <StyledSidebar>
          <H1>problemsets</H1>
          <ul>
            {groupedProblemsets.map((unit, unitIndex) => (
              <div key={unitIndex}>
                <h2>Unit {unitIndex + 1}</h2>
                <>{unit.map(mapProblemSetToJSX)}</>
              </div>
            ))}
          </ul>
        </StyledSidebar>
        {problemsetId && <ProblemsetContainer problemsetId={problemsetId} />}
      </StyledContainer>
    </>
  );
};

ProblemsetsContainer.propTypes = {
  match: object.isRequired
};

export default ProblemsetsContainer;
