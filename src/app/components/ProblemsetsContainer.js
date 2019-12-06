import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';
import { authFetch } from '../helpers/auth';
import { useIsUserAuth } from 'hooks';

import ProblemsetContainer from './ProblemsetContainer';
import StyledSidebar from 'app-styled/StyledSidebar';

const StyledContainer = styled.div`
  display: flex;
`;

const ProblemsetsContainer = ({
  match: {
    params: { default_order: defaultOrder }
  }
}) => {
  const [allProblemsets, setAllProblemsets] = useState();
  const [isUserAuth, user] = useIsUserAuth();
  const [groupedProblemsets, setGroupedProblemsets] = useState([]);
  const [fetchIsLoading, setFetchIsLoading] = useState(true);

  // console.log(defaultOrder, allProblemsets);

  const fetchProblemSets = async () => {
    if (isUserAuth && user) {
      // console.log('IS AUTH', isUserAuth, user);
      const response = await fetch(
        `${API_BASE_URL}/api/sections/${user.section_id}/problemsets`
      ).then(res => res.json());
      setFetchIsLoading(false);
      // console.log('problemsetss  !  !! ! ', response);
      const problemsets = response;
      setAllProblemsets(problemsets);
      const groupedProblemsets = groupProblemSetsByUnit(problemsets);
      setGroupedProblemsets(groupedProblemsets);
    } else {
      // console.log('IS NOT AUTH');
      const response = await fetch(`${API_BASE_URL}/api/problemsets`).then(
        res => res.json()
      );
      // console.log('response', response);
      setFetchIsLoading(false);
      const problemsets = response;
      setAllProblemsets(problemsets);
      const groupedProblemsets = groupProblemSetsByUnit(problemsets);
      setGroupedProblemsets(groupedProblemsets);
    }
  };

  const groupProblemSetsByUnit = problemsets => {
    // console.log('groupProblemSetsByUnit', problemsets);
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
    // console.log('IS USER AUTH CHANGED', isUserAuth);
    fetchProblemSets();
  }, [user]);

  useEffect(() => {
    // console.log('isUserAuth', isUserAuth);
    // console.log('user', user);
  });

  const getCurrentProblemsetFromDefaultOrder = defaultOrder =>
    allProblemsets.find(
      problemset => problemset.default_order === Number(defaultOrder)
    );

  const mapProblemSetToJSX = problemset => (
    <li key={problemset.id}>
      <Link to={`/problemsets/${problemset.default_order}`}>
        <div>
          <span className="numbering">
            Problemset #{problemset.default_order}
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
        {defaultOrder && allProblemsets && (
          <ProblemsetContainer
            problemsetId={getCurrentProblemsetFromDefaultOrder(defaultOrder).id}
            isUserAuth={isUserAuth}
          />
        )}
      </StyledContainer>
    </>
  );
};

ProblemsetsContainer.propTypes = {
  match: object.isRequired
};

export default ProblemsetsContainer;
