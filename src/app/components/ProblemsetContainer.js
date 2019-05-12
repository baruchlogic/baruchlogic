import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';

const ProblemsetContainer = ({ problemsetId }) => {
  const [problemset, setProblemset] = useState(null);

  const fetchProblemSet = async () => {
    const response = await fetch(
      `http://localhost:5000/api/problemsets/${problemsetId}`
    );
    console.log('response', response);
    const body = await response.json();
    console.log('body', body);
    setProblemset(body);
  };

  useEffect(() => {
    fetchProblemSet();
  }, problemsetId);

  console.log(problemset);

  const problemsetNumber =
    problemset && problemset.unit + problemset.index_in_unit - 1;

  return <div>{`Problemset #${problemsetNumber}`}</div>;
};

export default ProblemsetContainer;
