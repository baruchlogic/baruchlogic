import React, { useEffect, useState } from 'react';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';
import { authFetch } from '../helpers/auth';
import { useColumnView, useIsUserAuth } from 'hooks';

import ProblemsetContainer from './ProblemsetContainer';
import StyledSidebar from 'app-styled/StyledSidebar';

const ProblemsetsContainer = ({
  match: {
    params: { default_order: defaultOrder }
  }
}) => {
  const [allProblemsets, setAllProblemsets] = useState();
  const [isUserAuth, user] = useIsUserAuth();
  const [groupedProblemsets, setGroupedProblemsets] = useState([]);
  const [fetchIsLoading, setFetchIsLoading] = useState(true);
  const isColumnView = useColumnView();

  const fetchProblemSets = async () => {
    if (isUserAuth && user) {
      console.log('IS AUTH', isUserAuth, user);
      const response = await authFetch(
        `${API_BASE_URL}/api/sections/${user.section_id}/problemsets`
      ).then(res => res.json());
      setFetchIsLoading(false);
      const problemsets = response;
      setAllProblemsets(problemsets);
      const groupedProblemsets = groupProblemSetsByUnit(problemsets);
      setGroupedProblemsets(groupedProblemsets);
    } else {
      console.log('IS NOT AUTH');
      const response = await fetch(
        `${API_BASE_URL}/api/problemsets`
      ).then(res => res.json());
      setFetchIsLoading(false);
      const problemsets = response;
      setAllProblemsets(problemsets);
      const groupedProblemsets = groupProblemSetsByUnit(problemsets);
      setGroupedProblemsets(groupedProblemsets);
    }
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
  }, [user]);

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
      <div
        style={{
          display: 'flex',
          flexDirection: isColumnView ? 'column' : 'row'
        }}
      >
        <StyledSidebar column={isColumnView}>
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
            column={isColumnView}
          />
        )}
      </div>
    </>
  );
};

ProblemsetsContainer.propTypes = {
  match: object.isRequired
};

export default ProblemsetsContainer;
